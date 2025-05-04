import TextField from "@mui/material/TextField";

type Props = {
  name: string;
  type: string;
  label: string;
};

const CustomisedInput = (props: Props) => {
  return (
    <TextField
      margin="normal"
      name={props.name}
      label={props.label}
      type={props.type}
      slotProps={{
        input: {
          style: {
            width: "400px",
            borderRadius: 10,
            fontSize: 20,
            color: "white",
          },
        },
        inputLabel: {
          style: {
            color: "white",
          },
        },
      }}
    />
  );
};

export default CustomisedInput;
