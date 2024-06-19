import { colorPalette } from 'customTheme';

const textFieldStyles = {
  mb: '1.5rem',
  width: '100%',

  '& .MuiOutlinedInput-root': {
    color: colorPalette.secondary[100], // Default text color
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: colorPalette.yellow[500], // Default border color
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: colorPalette.secondary[100], // Border color on hover
    },
    '&:hover': {
      color: colorPalette.secondary[100], // Text color on hover
    },
  },
  '& .MuiInputLabel-outlined': {
    color: colorPalette.secondary[100], // Default label color
    '&:hover': {
      color: colorPalette.yellow[500], // Label color on hover
    },
    '&.Mui-focused': {
      color: colorPalette.yellow[500], // Label color on focus
      borderColor: colorPalette.secondary[100],
    },
  },
  '&.Mui-focused .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
    borderColor: colorPalette.secondary[100], // Border color on focus
    borderWidth: '3px', // Border width on focus
  },
  '&.Mui-focused .MuiOutlinedInput-root': {
    color: colorPalette.secondary[100], // Text color on focus
  },
  '& .MuiSvgIcon-root': {
    color: colorPalette.secondary[100], // Icon color
  },
  '& .MuiFormHelperText-root': {
    color: colorPalette.yellow[500], // Set your desired color here
    fontSize: '0.8rem',
  }
};

export default textFieldStyles;
