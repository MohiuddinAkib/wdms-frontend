import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { useTimer } from "react-timer-hook";
import { Controller, useForm } from "react-hook-form";
import { RequestOtpData } from "@/types/api-response";
import { useQueryClient } from "@tanstack/react-query";
import { MuiOtpInput } from "mui-one-time-password-input";
import { Location, useLocation } from "react-router-dom";
import {
  useGetAuthDataQuery,
  useLoginUserMutation,
  useRequestOtpMutation,
  useStoreAuthDataMutation,
} from "@/hooks/auth";
import {
  Card,
  Button,
  CardHeader,
  CardContent,
  CardActions,
  CircularProgress,
  FormHelperText,
} from "@mui/material";

function OtpPage() {
  const queryClient = useQueryClient();
  const location = useLocation() as Location<RequestOtpData>;
  const { isRunning, restart, minutes, seconds } = useTimer({
    autoStart: true,
    expiryTimestamp: dayjs().add(2, "m").toDate(),
  });
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: login, isPending } = useLoginUserMutation();
  const { mutate: storeAuthData } = useStoreAuthDataMutation({
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: useGetAuthDataQuery.getKey(),
      });
    },
    onError(error) {
      enqueueSnackbar({
        variant: "info",
        message: error.message,
      });
    },
  });

  const { mutate: requestOtp, isPending: isRequestingotp } =
    useRequestOtpMutation();
  const { control, handleSubmit, reset, setError } = useForm({
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    const email =
      location.state?.email ??
      new URLSearchParams(location.search).get("email") ??
      "";

    login(
      {
        email,
        otp: values.otp,
      },
      {
        onError(error) {
          console.log("otp" in error.field_errors);
          if ("otp" in error.field_errors) {
            setError("otp", {
              type: "api",
              message: error.field_errors.otp,
            });
          }

          if ("email" in error.field_errors) {
            enqueueSnackbar({
              variant: "error",
              message: error.field_errors.email,
            });
          }

          enqueueSnackbar({
            message: error.non_field_error,
            variant: "error",
          });
        },
        onSuccess(data) {
          reset();
          enqueueSnackbar({
            message: data.message,
            variant: data.success ? "success" : "error",
          });

          storeAuthData({
            isLoggedin: true,
            token: data.token,
          });
        },
      }
    );
  });

  const makeOtpRequest = () => {
    requestOtp(location.state, {
      onError(error) {
        enqueueSnackbar({
          variant: "error",
          message: error.non_field_error,
        });
      },
      onSuccess(data) {
        enqueueSnackbar({
          message: data.message,
          variant: data.success ? "success" : "error",
        });

        if (data.success) {
          restart(dayjs().add(2, "m").toDate());
        }
      },
    });
  };

  const paddedMinute = minutes.toString().padStart(2, "0");
  const paddedSecond = seconds.toString().padStart(2, "0");

  return (
    <div>
      <Card>
        <CardHeader title={"Otp verification"} />
        <form onSubmit={onSubmit}>
          <CardContent>
            <div className="gap-y-4 flex flex-col">
              <div>
                <Controller
                  name={"otp"}
                  control={control}
                  render={({ field, fieldState: { invalid, error } }) => {
                    return (
                      <>
                        <MuiOtpInput
                          length={6}
                          value={field.value}
                          onBlur={field.onBlur}
                          onChange={field.onChange}
                        />

                        {invalid && (
                          <FormHelperText error={invalid} className="mt-2">
                            {error?.message}{" "}
                          </FormHelperText>
                        )}
                      </>
                    );
                  }}
                />
              </div>
            </div>

            <Button
              size={"small"}
              className={"mt-5"}
              onClick={makeOtpRequest}
              disabled={isRunning || isRequestingotp}
            >
              Resend Otp {paddedMinute}:{paddedSecond}
            </Button>
          </CardContent>
          <CardActions className="justify-end">
            <Button
              type={"submit"}
              disableElevation
              variant="contained"
              disabled={isPending}
              startIcon={
                isPending ? (
                  <CircularProgress color="inherit" size={20} />
                ) : undefined
              }
            >
              Submit
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
}

export default OtpPage;
