import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useRegisterUserMutation } from "@/hooks/auth";
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

function RegisterPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: register, isPending } = useRegisterUserMutation();
  const { control, handleSubmit, reset, setError } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    if (values.password !== values.passwordConfirmation) {
      enqueueSnackbar({
        variant: "error",
        message: "Password didn't match",
      });

      return;
    }

    register(values, {
      onError(error) {
        if ("email" in error.field_errors) {
          setError("email", {
            type: "api",
            message: error.field_errors.email,
          });
        }

        if ("name" in error.field_errors) {
          setError("name", {
            type: "api",
            message: error.field_errors.name,
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

        navigate("/auth/login");
      },
    });
  });

  return (
    <div>
      <Card>
        <CardHeader title={"Sign up"} />
        <form onSubmit={onSubmit}>
          <CardContent>
            <div className="gap-y-4 flex flex-col">
              <div>
                <Controller
                  name={"name"}
                  control={control}
                  render={({ field, fieldState: { invalid, error } }) => {
                    return (
                      <TextField
                        fullWidth
                        size="small"
                        label={"Name"}
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
              <div>
                <Controller
                  control={control}
                  name={"passwordConfirmation"}
                  render={({ field, fieldState: { invalid, error } }) => {
                    return (
                      <TextField
                        fullWidth
                        size="small"
                        type={"password"}
                        error={invalid}
                        value={field.value}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        helperText={error?.message}
                        label={"Password confirmation"}
                      />
                    );
                  }}
                />
              </div>
            </div>
          </CardContent>
          <CardActions className="justify-between">
            <div>
              <Link component={AppLink} to={"/auth/login"}>
                Already have account?
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

export default RegisterPage;
