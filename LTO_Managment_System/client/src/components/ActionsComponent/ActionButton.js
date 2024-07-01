import { Button } from '@mui/material';
import { colorPalette } from 'customTheme';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function ActionButton({ handleClick, params, open }) {
  return (
    <Button
      id="basic-button"
      aria-controls={open ? 'basic-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={open ? 'true' : undefined}
      variant="contained"
      endIcon={<ExpandMoreIcon />}
      onClick={(event) => {
        handleClick(event, params);
      }}
      sx={{
        backgroundColor: colorPalette.yellow[500],
        color: colorPalette.black1[500],

        fontSize: '12px', // Adjust font size as needed
        fontWeight: 'bold',
        marginRight: '0.5rem',
        '&:hover': {
          backgroundColor: colorPalette.yellow[500],
          color: colorPalette.black1[500],
        },
      }}
    >
      Actions
    </Button>
  );
}
