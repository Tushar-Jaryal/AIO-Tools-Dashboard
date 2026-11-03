import { GridColumnMenu } from "@mui/x-data-grid";

// Offer filtering and hiding columns, but not sorting, in the column menu
const CustomColumnMenu = (props) => {
  return <GridColumnMenu {...props} slots={{ columnMenuSortItem: null }} />;
};

export default CustomColumnMenu;
