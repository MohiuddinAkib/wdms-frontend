import { Inbox } from "@mui/icons-material";
import { WalletDenominationResource } from "@/types/api-response";
import { Card, CardContent, Grid, Typography } from "@mui/material";

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

  const groupedItems = items.reduce((acc, curr) => {
    if (!(curr.type in acc)) {
      acc[curr.type] = [];
    }

    acc[curr.type].push(curr);
    return acc;
  }, {} as Record<string, WalletDenominationResource[]>);

  return (
    <Grid container spacing={2}>
      {Object.entries(groupedItems).map(([type, denominations]) => (
        <Grid item xs={12} md={6}>
          <Grid
            container
            spacing={2}
            key={type}
            className="border-r border-red-500"
          >
            <Grid item xs={12}>
              <Typography textTransform={"uppercase"}>{type}s:</Typography>
            </Grid>

            {denominations.map((eachDenomination) => (
              <Grid item xs={12} lg={4} key={eachDenomination.id}>
                <Card variant={"outlined"}>
                  <CardContent className="flex flex-col gap-y-2">
                    <Typography>name: {eachDenomination.name}</Typography>
                    <Typography>
                      Quantity: {eachDenomination.quantity}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}

export default WalletDenominationList;
