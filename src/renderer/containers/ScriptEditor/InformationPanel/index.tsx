import { Box, TextField } from "@mui/material";
import React, { ChangeEvent } from "react";
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux";
import { updateInformation } from "../../../actions/scriptEditor";
import { Information } from "../../../types/scriptEditor";
import { StoreRootState } from "../../../types/store";

type InformationPanelStateProps = {
  information: Information;
};

type InformationPanelDispatchProps = {
  handleInformationChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

type InformationPanelOwnProps = Record<string, never>;

type InformationPanelProps = InformationPanelStateProps &
  InformationPanelDispatchProps &
  InformationPanelOwnProps;

const InformationPanel = (props: InformationPanelProps): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column">
      <TextField
        name="name"
        variant="standard"
        size="small"
        margin="normal"
        label="Name"
        helperText={props.information.name.error}
        value={props.information.name.value}
        error={Boolean(props.information.name.error)}
        onChange={props.handleInformationChange}
      />
      <TextField
        multiline
        rows={5}
        name="description"
        variant="standard"
        size="small"
        margin="normal"
        label="Description"
        helperText={props.information.description.error}
        value={props.information.description.value}
        error={Boolean(props.information.description.error)}
        onChange={props.handleInformationChange}
      />
    </Box>
  );
};

const mapStateToProps: MapStateToProps<
  InformationPanelStateProps,
  InformationPanelOwnProps,
  StoreRootState
> = (state) => ({
  information: state.scriptEditor.information
});

const mapDispatchToProps: MapDispatchToProps<
  InformationPanelDispatchProps,
  InformationPanelOwnProps
> = (dispatch) => ({
  handleInformationChange: (event: ChangeEvent<HTMLInputElement>) =>
    dispatch(updateInformation(event.target.value, event.target.name))
});

export default connect(mapStateToProps, mapDispatchToProps)(InformationPanel);
