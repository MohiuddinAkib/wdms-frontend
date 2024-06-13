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
    <div className="flex gap-x-4">
      {Object.entries(groupedItems).map(([type, denominations]) => (
        <Grid item xs={12} md={6} lg={4} className="bg-blue-50">
          <div className="flex gap-x-4 flex-col p-2" key={type}>
            <Grid item xs={12}>
              <Typography textTransform={"uppercase"}>{type}s:</Typography>
            </Grid>

            {denominations.map((eachDenomination) => (
              <Grid item xs={12} key={eachDenomination.id}>
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
          </div>
        </Grid>
      ))}
    </div>
  );
}

export default WalletDenominationList;
