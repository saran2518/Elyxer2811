# Architecture rules

- Scope the Discover viewport-height layout to Early Access mode; reserve bottom navigation space in the welcome component so normal discovery remains unchanged.
- Fetch the community aggregate through an authenticated-only SECURITY DEFINER RPC with a fixed search path; never broaden membership row access to display totals.