import React, { Component } from 'react';
import { FormGroup, Label, Container, Row, Col } from 'reactstrap';
import Hashtag from "./Components/hashtag"
import styled from 'styled-components';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false,
      captions: null,
      captionIndex: 0,
      file: null,
      url: null
    }
    this.handleFileChange = this.handleFileChange.bind(this);
    this.upload = this.upload.bind(this);
    this.deleteHashtag = this.deleteHashtag.bind(this)
    this.nextCaption = this.nextCaption.bind(this)
  }



  render() {
    const { init, captions, captionIndex, hashtags, file, url } = this.state;
    return (
      <div style={{ backgroundImage: "linear-gradient(#C9D6FF, #E2E2E2)", minHeight: "100vh" }}>

        <Container >
          <Row>
            <Col className="justify-content-center">
              <Header color={"white"}>Captionize Yo Shit</Header>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col xs="12" sm="10" md="8" lg="7">
              <Background>
                {url &&
                  <ImgPreview src={url} alt="imgPreview" />
                }
                <Row>
                  <Col >
                    <FormGroup style={{ display: "flex", justifyContent: "center", paddingTop: url ? "0" : "10%", marginBottom: "0" }}>
                      <FileLabel for="file" >Upload Image</FileLabel>
                      <input type="file" name="file" id="file" onChange={(e) => this.handleFileChange(e.target.files[0])} style={{ display: "none" }} />
                    </FormGroup>
                  </Col>
                  {url &&
                    <Col style={{ display: "flex", justifyContent: "center" }}>
                      {file && <CaptionButton disabled={!file} onClick={this.upload}>Create Caption</CaptionButton>}
                    </Col>
                  }
                </Row>
                {init && <React.Fragment>
                  <Header color={"black"}>Caption</Header>
                  {init &&
                    <React.Fragment>
                      <Caption>{captions[captionIndex].quote}</Caption>
                      <NexCaptionButton onClick={this.nextCaption} >Show me a different Caption</NexCaptionButton>
                    </React.Fragment>
                  }
                  <br />
                  <Dot src="./record-button.png"></Dot>
                  <Dot src="./record-button.png"></Dot>
                  <Dot src="./record-button.png"></Dot>
                  <Dot src="./record-button.png"></Dot>
                  <Row>

                    {init && hashtags.map((h, index) =>
                      <Col key={index} xs="10" sm="6" md="3" lg="3">
                        <Hashtag hashtag={h} index={index} deleteHashtag={this.deleteHashtag} />
                      </Col>
                    )}

                  </Row>
                  <br />
                </React.Fragment>}
              </Background>
            </Col>

          </Row>

        </Container>
      </div>
    );
  }

  handleFileChange(file) {
    if (file) {
      let url = URL.createObjectURL(file)
      this.setState({ url: url, file: file })
    }
  }

  nextCaption() {
    if (this.state.captionIndex < this.state.captions.length) {
      let captionIndex = this.state.captionIndex + 1
      this.setState({ captionIndex: captionIndex })

    }
  }

  deleteHashtag(index) {
    let hashtags = [...this.state.hashtags]
    hashtags.splice(index, 1)
    this.setState({ hashtags: hashtags })
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

const Dot = styled.img`
  max-width: 0.4em 
  display: block;
  margin: 1.5em 0.5em 
`


const Caption = styled.div`
    text-align: center;
    /* border: 2px solid grey; */
    /* border-radius: 0.5rem; */
    width: 80%;
    margin: auto;
    padding: 0.5rem;
    font-size: calc(8px + 1vw)
    font-weight: 

`

const NexCaptionButton = styled.button`
  display: block;
  margin: 1em auto;
  color: white;
  background: #2ecc71;
  border: none;
  outline: none !important
  padding: 1em;
  border-radius: 0.5rem;
`

const CaptionButton = styled.button`
  text-align: center;
  display: block;
  cursor: pointer;
  width: 50%;
  margin-top: 7%;
  margin-bottom: 1.5rem;
  padding: 3%;
  background-color: #747d8c;
  outline: none !important
  border: none
  color: white;
  border-radius: 0.5rem;
  box-shadow: 0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08);
    `

const FileLabel = styled(Label)`
  text-align: center;
  display: block;
  cursor: pointer;
  width: 50%;
  margin-top: 7%;
  margin-bottom: 1.5rem;
  padding: 3%;
  /* border-style: solid; */
  /* border-width: 3px; */
  /* border-color: #A9A9A9; */
  background-color: #747d8c;
  color: white;
  border-radius: 0.5rem;
  box-shadow: 0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08);
    `


const ImgPreview = styled.img`
      width: 90%; 
      display: block; 
      margin:  auto;
      border-radius: 01rem
    `

const Background = styled.div`
        background-color: #FAFAFA;
        box-shadow: 0 15px 30px 0 rgba(0,0,0,0.11),
        0 5px 15px 0 rgba(0,0,0,0.08);
        border-radius: 0.5rem;
        margin-top: 5%;
        padding-top: 5%;
        min-height: 20em  
    `;

const Header = styled.div`
      text-align: center;
      color: ${ props => props.color ? props.color : "black"} 
      font-size: /*calc(16px + (24-16)*(100vw - 400px) / (800 - 400))*/ calc(12px + 3vw);
    `

export default App;
