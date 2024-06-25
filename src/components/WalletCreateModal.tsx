import clsx from "clsx";
import { useSnackbar } from "notistack";
import { WalletResource } from "@/types/api-response";
import { Controller, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import LoadableButton from "@components/ui/LoadableButton";
import {
  useCreateWalletMutation,
  useGetCurrenciesQuery,
  useGetWalletListQuery,
} from "@/hooks/wallet";
import {
  Dialog,
  useTheme,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  MenuItem,
} from "@mui/material";

type Props = {
  open: boolean;
  onClose?: () => void;
  existingWallets: WalletResource[];
};

function WalletCreateModal(props: Props) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const fullWidth = useMediaQuery(theme.breakpoints.down("md"));
  const { mutate: createWallet, isPending } = useCreateWalletMutation();
  const { data: currencies, isPending: isCurrenciesLoading } =
    useGetCurrenciesQuery();
  const { control, handleSubmit, setError, reset } = useForm({
    defaultValues: {
      currency: "",
    },
  });

  const existingWallets = new Set(
    props.existingWallets.map((eachWallet) => eachWallet.currency)
  );

  const onSubmit = handleSubmit((values) => {
    createWallet(values, {
      onError(error) {
        if ("currency" in error.field_errors) {
          setError("currency", {
            type: "api",
            message: error.field_errors.currency,
          });
        }

        enqueueSnackbar({
          variant: "error",
          message: error.non_field_error,
        });
      },
      onSuccess(data) {
        if (data.success) {
          queryClient.invalidateQueries({
            queryKey: useGetWalletListQuery.getKey(),
          });

          enqueueSnackbar({
            variant: "success",
            message: data.message,
          });

          reset();

          props.onClose?.();
        } else {
          enqueueSnackbar({
            variant: "error",
            message: data.message,
          });
        }
      },
    });
  });

  function handleClose() {
    reset();
    props.onClose?.();
  }

  return (
    <Dialog
      open={props.open}
      fullWidth={fullWidth}
      onClose={handleClose}
      classes={{
        paper: clsx({
          "min-w-[500px]": !fullWidth,
        }),
      }}
    >
      <DialogTitle>Create Wallet</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Controller
            name={"currency"}
            control={control}
            render={({ field, fieldState: { error, invalid } }) => {
              return (
                <TextField
                  select
                  fullWidth
                  label={"Select currency"}
                  disabled={isCurrenciesLoading}
                  placeholder={isCurrenciesLoading ? "Loading..." : ""}
                  size="small"
                  {...field}
                  error={invalid}
                  helperText={error?.message}
                >
                  {currencies?.data?.map((eachCurrency, i) =>
                    existingWallets.has(eachCurrency.code) ? null : (
                      <MenuItem key={i} value={eachCurrency.code}>
                        {eachCurrency.name}
                      </MenuItem>
                    )
                  )}
                </TextField>
              );
            }}
          />
        </DialogContent>

        <DialogActions>
          <LoadableButton
            type={"submit"}
            disableElevation
            variant="contained"
            loading={isPending}
          >
            Submit
          </LoadableButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default WalletCreateModal;
