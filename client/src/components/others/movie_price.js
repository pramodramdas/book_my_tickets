import React, { Component } from "react";
import { setMoviePrice } from "../../actions/admin";
import { DatePicker, Tag, Input, Button, message } from 'antd';

class MoviePrice extends Component {

    state = {
        sMovieId: "",
        sCID:"",
        sMovieStartTime:0,
        sMovieEndTime:0,
        sClass:"",
        sPrice:0
    }

    constructor(props) {
        super(props);
    };

    onTextChange = (key, eve) => {
        eve.preventDefault();
        if(eve && eve.target)
            this.setState({[key]: eve.target.value.trim()});
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    onStartChange = (value) => {
        if(this.state.sMovieEndTime !== 0 && new Date(value) >= new Date(this.state.sMovieEndTime)){
            message.error("start date cannot be greater than end date");
            return;
        }
        this.onChange('sMovieStartTime', value);
    }

    onEndChange = (value) => {
        if(this.state.sMovieStartTime !== 0 && new Date(this.state.sMovieStartTime) >= new Date(value)){
            message.error("end date cannot be greater than end date");
            return;
        }
        this.onChange('sMovieEndTime', value);
    }

    render() {
        const { sMovieStartTime, sMovieEndTime } = this.state;
        return (
            <div>
                <Tag color="geekblue"><p style={{color:"#adc6ff"}}>Add Show</p></Tag><br/><br/>
                <div style={{textAlign:"left"}}>
                   <Tag color="lime" style={{paddingRight:"40px"}}>movie Id</Tag>
                    <Input 
                        placeholder="movie id" 
                        style={{width:200}}
                        value={this.state.sMovieId}
                        onChange={this.onTextChange.bind(this, 'sMovieId')}
                    /><br/>
                    <Tag color="lime" style={{paddingRight:"40px"}}>cinema id</Tag>
                    <Input 
                        placeholder="cinema id" 
                        style={{width:200}}
                        value={this.state.sCID}
                        onChange={this.onTextChange.bind(this, 'sCID')}
                    /><br/>
                    <Tag color="lime" style={{paddingRight:"40px"}}>start time</Tag>
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{width:200}}
                        value={sMovieStartTime}
                        placeholder="Start"
                        onChange={this.onStartChange}
                    /><br/>
                    <Tag color="lime" style={{paddingRight:"40px"}}>end time</Tag>
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{width:200}}
                        value={sMovieEndTime}
                        placeholder="End"
                        onChange={this.onEndChange}
                    /><br/>
                    <Tag color="lime" style={{paddingRight:"40px"}}>class</Tag>
                    <Input 
                        placeholder="class" 
                        style={{width:200}}
                        value={this.state.sClass}
                        onChange={this.onTextChange.bind(this, 'sClass')}
                    /><br/>
                    <Tag color="lime" style={{paddingRight:"40px"}}>Price in wei</Tag>
                    <Input 
                        placeholder="price" 
                        style={{width:200}}
                        value={this.state.sPrice}
                        onChange={this.onTextChange.bind(this, 'sPrice')}
                    /><br/>
                </div><br/>
                <Button 
                    type="primary"
                    onClick={setMoviePrice.bind(this)}
                >submit</Button>
            </div>
        );
    }
}

export default MoviePrice;
