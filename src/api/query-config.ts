export const recentQueryConfig = {
  defaults: [
    "id",
    "customer_id",
    "sales_channel_id",
    "post_type",
    "created_at",
    "updated_at",
    "items.*",
  ],
};

export const listRecentsQueryConfig = {
  ...recentQueryConfig,
  isList: true,
};

export const retrieveRecentQueryConfig = {
  ...recentQueryConfig,
  isList: false,
};
