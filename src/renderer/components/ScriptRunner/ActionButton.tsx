import { Box, Button, CircularProgress, Icon } from "@mui/material";
import { ActionButtonColor } from "./types";

type ActionButtonProps = {
  spinning: boolean;
  color: ActionButtonColor;
  icon: string;
  onClick: () => void;
};

function ActionButton({ spinning, color, icon, onClick }: ActionButtonProps) {
  return (
    <Box position="relative">
      <Button
        variant="contained"
        color={color}
        onClick={onClick}
        sx={{
          padding: 0,
          minWidth: 0,
          height: 40,
          width: 40,
          borderRadius: 12,
          zIndex: 1
        }}
      >
        <Icon>{icon}</Icon>
      </Button>
      {spinning && (
        <CircularProgress
          size={50}
          sx={{ position: "absolute", top: -5, left: -5 }}
        />
      )}
    </Box>
  );
}

export default ActionButton;
