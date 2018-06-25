import {connect} from "react-redux";
import App from './App'
import {setMessage} from "./appReducer";

let mapStateToProps = ({app}) => ({
  message1: app.message,
});

let mapDispatchToProps = dispatch => ({
  updateMessage: (messageText) => dispatch(setMessage(messageText)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);