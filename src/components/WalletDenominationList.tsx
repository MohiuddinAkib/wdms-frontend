import { WalletDenominationResource } from "@/types/api-response";
import { Inbox } from "@mui/icons-material";
import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";

type Props = {
  items: WalletDenominationResource[];
};
function WalletDenominationList({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center h-40 flex items-center justify-center flex-col">
        <Inbox fontSize={"large"} className="mb-4" />
        <Typography align="center">No Denominations Created</Typography>
      </div>
    );
  }

  return (
    <Grid container spacing={2}>
      {items.map((eachDenomination) => (
        <Grid item xs={12} md={6} lg={4} key={eachDenomination.id}>
          <Card variant={"outlined"}>
            <CardHeader title={eachDenomination.name} />
            <CardContent className="flex flex-col gap-y-2">
              <Typography>Type: {eachDenomination.type}</Typography>
              <Typography>Value: {eachDenomination.value}</Typography>
              <Typography>Quantity: {eachDenomination.quantity}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default WalletDenominationList;
