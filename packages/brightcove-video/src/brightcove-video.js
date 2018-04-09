import React, { Component } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  NativeModules,
  NativeEventEmitter,
} from 'react-native'
import PropTypes from 'prop-types'

import Player from './brightcove-player'
import Splash from './splash'
import VideoError from './error'

const { RNTBrightcoveVideoEventSignal } = NativeModules

const videoSignal = new NativeEventEmitter(RNTBrightcoveVideoEventSignal)

const BrightcoveFullscreenPlayerModule =
  NativeModules.BrightcoveFullscreenPlayer

class BrightcoveVideo extends Component {
  static getBrightcoveFullscreenPlayerModule() {
    return BrightcoveFullscreenPlayerModule
  }

  constructor(props) {
    super(props)

    this.state = {
      isLaunched: props.autoplay,
      error: null,
    }

    this.play = this.play.bind(this)
    this.reset = this.reset.bind(this)
    this.handleFinish = this.handleFinish.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  // specifically check if is launched has changed and block update if it has not;
  // this is so we don't keep reseting our player reference
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.isLaunched !== this.state.isLaunched ||
      nextState.error !== this.state.error ||
      nextProps !== this.props
    )
  }
  componentWillUnmount() {
    this.removeSignals()
  }

  setupSignals() {
    if (!this.state.onPlay && !this.state.onClose) {
      const onPlay = videoSignal.addListener('onPlayNotification', reminder =>
        this.props.onPlay(),
      )
      const onClose = videoSignal.addListener('onCloseNotification', reminder =>
        this.props.onFinish(),
      )
      this.setState({ ...this.state, onPlay, onClose })
    }
  }

  removeSignals() {
    if (this.state.onPlay && this.state.onClose) {
      this.state.onPlay.remove()
      this.state.onClose.remove()
    }
  }

  play() {
    const nativeModule = BrightcoveVideo.getBrightcoveFullscreenPlayerModule()

    if (nativeModule && this.props.directToFullscreen) {
      this.setupSignals()
      nativeModule.playVideo({
        accountId: this.props.accountId,
        videoId: this.props.videoId,
        policyKey: this.props.policyKey,
      })
    } else {
      if (this.playerRef) {
        this.playerRef.play()
      }

      this.setState({ isLaunched: true })
    }
  }

  pause() {
    if (this.playerRef) {
      this.playerRef.pause()
    }
  }

  reset() {
    this.setState({ isLaunched: false, error: null })
  }

  handleFinish() {
    if (this.props.resetOnFinish) {
      this.reset()
    }

    this.props.onFinish()
  }

  handleError(error) {
    this.setState({ error })

    this.props.onError(error)
  }

  render() {
    this.playerRef = null

    if (this.state.error) {
      return <VideoError {...this.props} onReset={this.reset} />
    }

    if (this.state.isLaunched) {
      return (
        <Player
          ref={ref => {
            this.playerRef = ref
          }}
          {...this.props}
          onError={this.handleError}
          onFinish={this.handleFinish}
          autoplay
        />
      )
    }

    return (
      <TouchableWithoutFeedback onPress={this.play}>
        <View style={{ width: this.props.width, height: this.props.height }}>
          <Splash {...this.props} />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

BrightcoveVideo.propTypes = {
  resetOnFinish: PropTypes.bool,
  directToFullscreen: PropTypes.bool,
  ...Splash.propTypes,
  ...Player.propTypes,
}

BrightcoveVideo.defaultProps = Object.assign(
  {
    resetOnFinish: false,
    directToFullscreen: false,
  },
  Splash.defaultProps,
  Player.defaultProps,
)

export default BrightcoveVideo
