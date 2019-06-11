<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <img src="@/assets/404/bubble.png" class="bubble" alt="" style="width: 23px">
        <img class="pic-404__parent" src="@/assets/404/404.png" alt="404" style="width: 301px">
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">OOPS!</div>
        <div class="bullshit__headline">{{ message }}</div>
        <div class="bullshit__info">Please check that the URL you entered is correct,
          or click the button below to return to the homepage.</div>
        <a href="/" class="bullshit__return-home">Back to 首页</a>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Page404',
  computed: {
    message() {
      return 'The webmaster said that you can not enter this page...';
    },
  },
};
</script>

<style lang="scss" scoped>


.wscn-http404-container{
  transform: translate(-50%,-50%);
  position: absolute;
  top: 40%;
  left: 50%;
  padding: 50px 0;

  background: hsla(0,10%,100%,.25) border-box;
  background-color: #0A497E;
    overflow: hidden;
    border-radius: .3em;
    box-shadow: inset 0 0 0 1px hsla(0,0%,100%,.3), 0 0.5em 1em rgba(0,0,0,.3);
    text-shadow: 0 1px 1px hsla(0,0%,100%,.3);

    &::before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: -30px;
      z-index: -1;
      background: #0A497E;
      -webkit-filter: blur(20px);
      filter: blur(20px);
    }
}
.wscn-http404 {
  position: relative;
  width: 800px;
  padding: 0 50px;

  // overflow: hidden;
  .pic-404 {
    position: relative;
    float: left;
    width: 300px;
    // overflow: hidden;
    margin-right: 20px;


    .bubble {
      position: absolute;
      left: 65px;
      top: 30px;
      transform-origin: 0 100%;
      animation-name: bubbleScale;
      animation-duration: 3s;
      // animation-fill-mode: forwards;
      animation-iteration-count: infinite;
    }
    @keyframes bubbleScale {
      0% {
        transform: scale(1)
      }

      50% {
        transform: scale(0.4)
      }
      100% {
        transform: scale(1)
      }
    }


    &__parent {
      width: 100%;
    }

  }
  .bullshit {
    position: relative;
    float: left;
    width: 300px;
    // padding: 30px 0;
    overflow: hidden;
    &__oops {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      color: #1482f0;
      opacity: 0;
      margin-bottom: 20px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }
    &__headline {
      font-size: 20px;
      line-height: 24px;
      color: #fff;
      font-weight: bold;
      opacity: 0;
      margin-bottom: 10px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }
    &__info {
      font-size: 13px;
      line-height: 21px;
      color: #f7f7f7;
      opacity: 0;
      margin-bottom: 30px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }
    &__return-home {
      display: block;
      float: left;
      width: 110px;
      height: 36px;
      background: #1482f0;
      border-radius: 100px;
      text-align: center;
      color: #ffffff;
      opacity: 0;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
    }
    @keyframes slideUp {
      0% {
        transform: translateY(60px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
}
</style>
