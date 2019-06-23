import React, { Component } from 'react';
import { FormGroup, Label, Container, Row, Col } from 'reactstrap';
import Hashtag from "./Components/hashtag"
import styled from 'styled-components';

const captions = ["Deine Eltern sind auf einem Tennistunier", "If you Know you Know", "If you don't know you you don't know", "I belive I can fly"]
const hashtags = ["# HUHUH", "# HUHUH", "# HUHUH", "# HUHUH", "# HUHUH"]
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
      <React.Fragment>
        <Container>
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
                  <Header color={"black"}>Captions</Header>
                  {init &&
                    <React.Fragment>
                      <Caption>{captions[captionIndex]}</Caption>
                      <NexCaptionButton onClick={this.nextCaption} />
                    </React.Fragment>
                  }
                  <br />
                  <p>.</p>
                  <p>.</p>
                  <p>.</p>
                  <p>.</p>
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
      </React.Fragment>
    );
  }

  handleFileChange(file) {
    if (file) {
      let url = URL.createObjectURL(file)
      this.setState({ url: url, file: file })
    }
  }

  nextCaption() {
    if (this.state.captionIndex >= this.state.captions.length) {
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
      .then((res) => this.setState({ init: true, captions: res.captions, hashtags: res.hashtags }))
  }
}

const Caption = styled.div`

`

const NexCaptionButton = styled.button`

`

const CaptionButton = styled.button`
      width: 50%; 
      margin-top: 7% ; 
      margin-bottom: 1.5rem
      padding: 3% ;
      border-style: solid; 
      border-width: 3px;
      border-color: #A9A9A9;
      background-color: white; 
      border-radius: 0.5rem
      outline: none !important 
      box-shadow: 0 15px 30px 0 rgba(0,0,0,0.11),
        0 5px 15px 0 rgba(0,0,0,0.08);
    `

const FileLabel = styled(Label)`
      text-align: center; 
      display: block; 
      cursor: pointer;
      width: 50%; 
      margin-top: 7% ; 
      marign-bottom: 1.5rem
      padding: 3% 
      border-style: solid; 
      border-width: 3px;
      border-color: #A9A9A9;
      background-color: white; 
      border-radius: 0.5rem 
      box-shadow: 0 15px 30px 0 rgba(0,0,0,0.11),
        0 5px 15px 0 rgba(0,0,0,0.08);
    `


const ImgPreview = styled.img`
      width: 90%; 
      display: block; 
      margin:  auto;
      border-radius: 01rem
    `

const Background = styled.div`
        background-color: #ECE9E6;
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
      font-size: /*calc(16px + (24-16)*(100vw - 400px) / (800 - 400))*/ calc(16px + 3vw);
    `

export default App;
