import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useRequestOtpMutation } from "@/hooks/auth";
import { Controller, useForm } from "react-hook-form";
import {
  Card,
  Button,
  TextField,
  CardHeader,
  CardContent,
  CardActions,
  CircularProgress,
  Link,
} from "@mui/material";
import AppLink from "@/components/ui/AppLink";

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

  const onSubmit = handleSubmit((values) => {
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

export default LoginPage;
