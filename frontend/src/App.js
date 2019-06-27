import React, { Component } from 'react';
import { FormGroup, Label, Container, Row, Col } from 'reactstrap';
import Hashtag from "./Components/hashtag"
import Input from "./Components/input"
import styled from 'styled-components';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      captions: null,
      init: false,
      captionInit: false,
      hashtagInit: false,
      showMessage: false,
      inputFields: ["Mood", "Theme", "What Else ?"],
      captionIndex: 0,
      file: null,
      url: null,
      text: ""
    }
    this.textArea = React.createRef();

    this.handleFileChange = this.handleFileChange.bind(this);
    this.upload = this.upload.bind(this);
    this.deleteHashtag = this.deleteHashtag.bind(this)
    this.nextCaption = this.nextCaption.bind(this)
    this.createText = this.createText.bind(this)
    this.captionInit = this.captionInit.bind(this)
    this.prevCaption = this.prevCaption.bind(this)
    this.safeCaption = this.safeCaption.bind(this)
  }



  render() {
    const { init, captions, captionInit, captionIndex, hashtags, file, url, text, inputFields, hashtagInit, } = this.state;
    return (
      <div style={{ backgroundImage: "linear-gradient(#C9D6FF, #E2E2E2)", minHeight: "100vh" }}>
        <Container >
          <Row>
            <Col className="justify-content-center">
              <Header color={"white"} noMargin >Captionize Yo Shit</Header>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col xs="12" sm="10" md="8" lg="7">
              <Background>
                {file && url &&
                  <ImgPreview src={url} alt="imgPreview" />
                }
                <Row>
                  <Col >
                    <FormGroup style={{ display: "flex", justifyContent: "center", paddingTop: url ? "0" : "10%", marginBottom: "0" }}>
                      <FileLabel for="file" >Upload Image</FileLabel>
                      <input type="file" name="file" id="file" onChange={(e) => this.handleFileChange(e.target.files[0])} style={{ display: "none" }} />
                    </FormGroup>
                  </Col>
                </Row>
                {url &&
                  <Row className="justify-content-center">
                    <Col>
                      <Header small> Sag uns in 3 Wörtern was du mit diesem Bild aussagen Wilst</Header>
                      <Row className="justify-content-center">
                        {inputFields.map((text, index) =>
                          <Col key={index} xs="11" sm="11" md="3" lg="3" >
                            <Input placeholder={text} key={index} />
                          </Col>
                        )}
                      </Row>
                      <CreateCaptionButton disabled={!file} onClick={this.upload}>Create Caption</CreateCaptionButton>
                    </Col>
                  </Row>
                }
                {captionInit && <React.Fragment>
                  <Header color={"black"} noMargin >Caption</Header>
                  {init &&
                    <React.Fragment>
                      {captionIndex < captions.length - 1 ?
                        <React.Fragment>
                          <Caption>{captions[captionIndex].quote}</Caption>
                          <Row className="justify-content-center">
                            <Col xs="4" sm="4" md="4" lg="4">
                              <CaptionButton onClick={this.prevCaption} >Previous Caption</CaptionButton>
                            </Col>
                            <Col xs="4" sm="4" md="4" lg="4">
                              <CaptionButton onClick={this.nextCaption} >Next Caption</CaptionButton>
                            </Col>
                            <Col xs="4" sm="4" md="4" lg="4">
                              <CaptionButton onClick={this.safeCaption} >I Like that Caption</CaptionButton>
                            </Col>
                          </Row>
                        </React.Fragment>
                        :
                        <p>Seems Like there are no more Captions Available</p>
                      }
                    </React.Fragment>
                  }
                  {hashtagInit &&
                    <React.Fragment>
                      <Header small>Here are some Hashtags for your Image</Header>
                      <br />
                      <Dot src="./circle-shape-outline.png"></Dot>
                      <Dot src="./circle-shape-outline.png"></Dot>
                      <Dot src="./circle-shape-outline.png"></Dot>
                      <Dot src="./circle-shape-outline.png"></Dot>
                      <Row>
                        {init && hashtags.map((h, index) =>
                          <Col key={index} xs="6" sm="6" md="6" lg="3">
                            <Hashtag hashtag={h} index={index} deleteHashtag={this.deleteHashtag} />
                          </Col>
                        )}
                      </Row>
                      <FinalizeButton onClick={this.createText}>Copy Caption</FinalizeButton>
                      <textarea value={text} ref={this.textArea} style={{ display: "none" }} onChange={this.dummyOnChange}></textarea>
                    </React.Fragment>
                  }
                  <br />


                </React.Fragment>}
              </Background>
            </Col>

          </Row>

          {/* {showMessage && <Message>You can simply delete a Hashtag by clicking it</Message>} */}
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

  dummyOnChange() {
    return null
  }

  captionInit() {
    this.setState({ captionInit: true })
  }

  prevCaption() {
    if (this.state.captionIndex > 0) {
      let index = this.state.captionIndex - 1
      this.setState({ captionIndex: index })
    }
  }

  createText(e) {
    let hashtags = "" + this.state.hashtags
    let string = this.state.captions[this.state.captionIndex].quote + "\n . \n . \n . \n . \n" + hashtags.replace(/ /g, "").replace(/,/g, " ")
    this.setState({ text: string }, this.copyText())

  }

  copyText() {
    this.textArea.current.focus()
    document.execCommand('copy')
  }

  nextCaption() {
    if (this.state.captionIndex < this.state.captions.length - 1) {
      let captionIndex = this.state.captionIndex + 1
      this.setState({ captionIndex: captionIndex })
    }
  }

  safeCaption() {
    this.setState({ hashtagInit: true, showMessage: true })
    setTimeout(() => {
      this.setState({
        showMessage: true
      })
    }, 5000)
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
      .then((res) => this.setState({ init: true, captionInit: true, captions: res.captions, hashtags: res.hashtags, predictions: res.predictions }))
  }
}

const Dot = styled.img`
      max-width: 0.4em
      display: block;
      margin: 1.5em 0.5em
    `


const Caption = styled.div`
        text-align: center;
        margin: auto;
        padding: 0.5rem;
        font-size: calc(8px + 1vw)
        font-weight:
    `

const CreateCaptionButton = styled.button`
      display: block;
      margin: 1em auto;
      color: white;
      background: rgb(201, 214, 255);
      border: none;
      outline: none !important
      padding: 1em;
      border-radius: 0.5rem;
    `

const CaptionButton = styled.button`
      text-align: center;
      display: block;
      cursor: pointer;
      width: 90%;
      font-size: calc(6px + 0.8vw);
      margin: 2em auto 0 auto;
      padding: 3%;
      background-color: rgb(201, 214, 255);
      outline: none !important
      border: none
      color: white;
      border-radius: 0.5rem;
    `

// const Message = styled.div`
//       postion: absolute
//     `

const FileLabel = styled(Label)`
      text-align: center;
      cursor: pointer;
      display: inline-block
      margin-top: 2em;
      padding: 1em;
      background-color: rgb(201, 214, 255);
      color: white;
      border-radius: 0.5rem;
      // box-shadow: 0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08);
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
    margin: 5% 0 3em 0;
    padding-top: 5%;
    min-height: 20em
`;

const Header = styled.div`
  text-align: center;
  margin-top: ${props => props.noMargin ? "0" : "2em"}
  color: ${props => props.color ? props.color : "black"}
  font-size: ${props => props.small ? "calc(8px + 00.5vw) " : "calc(12px + 3vw)"} ;
`

const FinalizeButton = styled.button`
display: block;
margin: 1em auto;
color: white;
background: rgb(201, 214, 255);
border: none;
outline: none !important
padding: 1em;
border-radius: 0.5rem;
`

export default App;
