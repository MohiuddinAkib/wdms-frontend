import { useSnackbar } from "notistack";
import { getCsrfToken } from "@/utils/http";
import AppLink from "@/components/ui/AppLink";
import { useNavigate } from "react-router-dom";
import { useRequestOtpMutation } from "@/hooks/auth";
import { Controller, useForm } from "react-hook-form";
import LoadableButton from "@/components/ui/LoadableButton";
import {
  Card,
  TextField,
  CardHeader,
  CardContent,
  CardActions,
  Link,
} from "@mui/material";

function LoginPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: requestOtp, isPending } = useRequestOtpMutation();
  const { control, handleSubmit, reset, setError } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await getCsrfToken();

    requestOtp(values, {
      onError(error) {
        if ("email" in error.field_errors) {
          setError("email", {
            type: "api",
            message: error.field_errors.email,
          });
        }

        if ("password" in error.field_errors) {
          setError("password", {
            type: "api",
            message: error.field_errors.password,
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

        const search = new URLSearchParams({
          email: values.email,
        }).toString();

        navigate(
          {
            pathname: "/auth/otp",
            search: `?${search}`,
          },
          {
            state: values,
          }
        );
      },
    });
  });

  return (
    <div>
      <Card>
        <CardHeader title={"Sign In"} />
        <form onSubmit={onSubmit}>
          <CardContent>
            <div className="gap-y-4 flex flex-col">
              <div>
                <Controller
                  name={"email"}
                  control={control}
                  render={({ field, fieldState: { invalid, error } }) => {
                    return (
                      <TextField
                        fullWidth
                        size="small"
                        type={"email"}
                        label={"Email"}
                        error={invalid}
                        value={field.value}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        helperText={error?.message}
                      />
                    );
                  }}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name={"password"}
                  render={({ field, fieldState: { invalid, error } }) => {
                    return (
                      <TextField
                        fullWidth
                        size="small"
                        error={invalid}
                        type={"password"}
                        label={"Password"}
                        value={field.value}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        helperText={error?.message}
                      />
                    );
                  }}
                />
              </div>
            </div>
          </CardContent>
          <CardActions className="justify-between">
            <div>
              <Link component={AppLink} to={"/auth/register"}>
                Don't have account?
              </Link>
            </div>

            <LoadableButton
              type={"submit"}
              disableElevation
              variant="contained"
              loading={isPending}
            >
              Submit
            </LoadableButton>
          </CardActions>
        </form>
      </Card>
    </div>
  );
}

export default LoginPage;
