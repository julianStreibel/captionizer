import React, { Component } from 'react';
import { Button, FormGroup, Label, Input, FormText } from 'reactstrap';
import styled from 'styled-components';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false,
      captions: [],
      file: null
    }
    this.handleFileChange = this.handleFileChange.bind(this);
    this.upload = this.upload.bind(this);
  }

  render() {
    const { init, captions, hashtags, file, predictions } = this.state;
    return (
      <React.Fragment>
        <FormGroup>
          <Label for="exampleFile">File</Label>
          <Input type="file" name="file" onChange={(e) => this.handleFileChange(e.target.files[0])} />
          <FormText color="muted">
            This is some placeholder block-level help text for the above input.
            It's a bit lighter and easily wraps to a new line.
          </FormText>
        </FormGroup>
        <Button disabled={!file} onClick={this.upload}>Upload</Button>
        {init && <React.Fragment>
          <h1>Predictions</h1>
          {init && predictions.map(h => h + ", ")}
          <h3>Captions</h3>
          {init && captions.map(caption => <p>"{caption.quote}" <br /> {caption.author}</p>)}
          <h3>Hashtags</h3>
          {init && hashtags.map(h => h.replace(" ", "") + " ")}
          <br />
          <RedButton>Hi</RedButton>
          <br />
          <DivButton
            color={"orange"}
          >Hii</DivButton>
        </React.Fragment>}
      </React.Fragment>
    );
  }

  handleFileChange(file) {
    this.setState({ file })
  }

  upload() {
    const { file } = this.state;
    let formData = new FormData();
    formData.append("image", file)
    fetch("http://127.0.0.1:8080/api/v1/picture", { method: "post", body: formData })
      .then(res => res.json())
      .then((res) => this.setState({ init: true, captions: res.captions, hashtags: res.hashtags, predictions: res.predictions }))
  }
}

const RedButton = styled(Button)`
  background-color: red !important;
`;

const DivButton = styled.div`
  height: 20px;
  width: 50px;
  ${props => props.color && `background-color: ${props.color};`}
`;

export default App;
