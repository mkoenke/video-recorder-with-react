import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import VideocamIcon from '@material-ui/icons/Videocam';
import TestVideoRecordPage from './TestVideoRecordPage';
const useStyles = (theme) => ({
    root: {
      '& > svg': {
        margin: theme.spacing(2),
      },
    },
    recordIcon: {
        color: '#56b07d',
        width: 100,
        height: 40, 
        marginLeft: '45%', 
        marginRight: 'auto'
    }
});


class VideoRecorderIcon extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isRecordPageOpen: false
        }
        this.handleRecordIcon = this.handleRecordIcon.bind(this)
    }

    handleRecordIcon = () =>{
        console.log('............record icon clicked');
        this.setState({
            isRecordPageOpen: true
        })
    }

    render(){
        const {classes}  = this.props;

        return(
            <div className="record-icon" >
                <VideocamIcon className={classes.recordIcon}
                onClick={this.handleRecordIcon}
                />
                Click on the icon to access media
                {
                    this.state.isRecordPageOpen ? <TestVideoRecordPage/> : null
                }
            </div>
        )
    }
}

export default withStyles(useStyles)(VideoRecorderIcon);