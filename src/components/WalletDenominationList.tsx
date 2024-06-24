import { Delete, Inbox } from "@mui/icons-material";
import { WalletDenominationResource } from "@/types/api-response";
import {
  Card,
  Grid,
  CardHeader,
  Typography,
  IconButton,
  CardContent,
  CircularProgress,
} from "@mui/material";

type Props = {
  isRemoving: boolean;
  items: WalletDenominationResource[];
  onDenominationRemove: (denominationId: string) => void;
};
function WalletDenominationList({
  items,
  onDenominationRemove,
  isRemoving,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center h-40 flex items-center justify-center flex-col">
        <Inbox fontSize={"large"} className="mb-4" />
        <Typography align="center">No Denominations Created</Typography>
      </div>
    );
  }

  const groupedItems = items.reduce((acc, curr) => {
    if (!(curr.type in acc)) {
      acc[curr.type] = [];
    }

    acc[curr.type].push(curr);
    return acc;
  }, {} as Record<string, WalletDenominationResource[]>);

  return (
    <div className="flex gap-x-4">
      {Object.entries(groupedItems).map(([type, denominations]) => (
        <Grid item xs={12} md={6} lg={4} className="bg-blue-50" key={type}>
          <div className="flex gap-x-4 flex-col p-2" key={type}>
            <Grid item xs={12}>
              <Typography textTransform={"uppercase"}>{type}s:</Typography>
            </Grid>

            {denominations.map((eachDenomination) => (
              <Grid item xs={12} key={eachDenomination.id}>
                <Card variant={"outlined"}>
                  <CardHeader
                    title={eachDenomination.name}
                    titleTypographyProps={{
                      variant: "subtitle1",
                      fontWeight: "bold",
                    }}
                    action={
                      <IconButton
                        disabled={isRemoving}
                        onClick={onDenominationRemove.bind(
                          null,
                          eachDenomination.id
                        )}
                      >
                        {isRemoving ? (
                          <CircularProgress size={20} />
                        ) : (
                          <Delete />
                        )}
                      </IconButton>
                    }
                    className="pb-0"
                  />
                  <CardContent>
                    <Typography>
                      Quantity: {eachDenomination.quantity}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </div>
        </Grid>
      ))}
    </div>
  );
}

export default WalletDenominationList;
