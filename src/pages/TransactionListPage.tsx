import clsx from "clsx";
import React from "react";
import dayjs from "dayjs";
import { TransactionResource } from "@/types/api-response";
import { useGetTransactionListQuery } from "@/hooks/wallet";
import FullPageSpinner from "@/components/ui/FullPageSpinner";
import {
  Card,
  Grid,
  List,
  ListItem,
  Typography,
  ListItemText,
  CardActions,
  Pagination,
  CardHeader,
  Alert,
} from "@mui/material";

function TransactionListPage() {
  const [page, setPage] = React.useState(1);

  const {
    data: transactionList,
    isPending,
    isError,
    error,
  } = useGetTransactionListQuery({
    variables: {
      page,
    },
  });

  if (isPending) {
    return <FullPageSpinner />;
  }

  function handlePageChange(
    _event: React.ChangeEvent<unknown>,
    newPage: number
  ) {
    setPage(newPage);
  }

  const groupedTrans =
    transactionList?.data?.reduce((acc, curr) => {
      if (!(curr.group_id in acc)) {
        acc[curr.group_id] = [];
      }

      acc[curr.group_id].push(curr);

      return acc;
    }, {} as Record<string, TransactionResource[]>) ?? {};

  const listItems = Object.entries(groupedTrans).map(([grpId, eachTran]) => {
    const happenedAt = eachTran[0].happened_at;

    return (
      <div key={grpId} className="flex-col px-5 mb-5">
        <ListItemText
          secondary={`Currency: ${eachTran[0].wallet_currency}`}
          primary={dayjs(happenedAt).format("YYYY-MM-DD hh:mm:ss A")}
          primaryTypographyProps={{
            variant: "h6",
          }}
        />

        <List>
          {eachTran.map((tran, i) => (
            <ListItem
              key={i}
              secondaryAction={
                <Typography>Quantity: {tran.quantity}</Typography>
              }
              divider
            >
              <ListItemText
                primary={`${tran.denomination_name} - ${tran.denomination_type}`}
                secondary={`Status: ${tran.type}`}
                secondaryTypographyProps={{
                  className: clsx({
                    "text-green-500": tran.type === "add",
                    "text-red-500": tran.type === "withdraw",
                  }),
                }}
              />
            </ListItem>
          ))}
        </List>
      </div>
    );
  });

  return (
    <Grid container justifyContent={"center"}>
      <Grid item xs={12}>
        <Typography variant="h6" className="my-6" align={"center"}>
          Transactions
        </Typography>
      </Grid>

      {isError ? (
        <Grid item xs={12} lg={7}>
          <Alert color="error">{error.non_field_error}</Alert>
        </Grid>
      ) : (
        <Grid item xs={12} lg={10}>
          <Card variant="outlined">
            <CardHeader />
            <List className="h-[600px] overflow-y-auto">
              {listItems.length > 0 ? (
                listItems
              ) : (
                <Typography>No Transacitons found</Typography>
              )}
            </List>

            <CardActions className="justify-center">
              <Pagination
                page={page}
                onChange={handlePageChange}
                count={transactionList?.last_page ?? 1}
              />
            </CardActions>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}

export default TransactionListPage;
