<template>
  <div class="login-container">
    <a-form
      class="login-form"
      :form="form"
    >
      <div class="logo-container">
        后台系统
      </div>
      <a-tabs
        default-active-key="2"
        :tab-bar-style="tabStyle"
      >
        <a-tab-pane
          key="1"
          tab="钉钉登录"
        >
          钉钉登录
        </a-tab-pane>
        <a-tab-pane
          key="2"
          tab="账号登录"
        >
          <a-form-item>
            <a-input
              v-decorator="[
                'email',
                {rules: [{ required: true, message: '请输入邮箱' }]}
              ]"
              placeholder="邮箱地址"
            >
              <a-icon
                slot="prefix"
                type="user"
                style="color:rgba(0,0,0,.25)"
              />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              ref="password"
              v-decorator="[
                'password',
                {rules: [{ required: true, message: '请输入密码' }]}
              ]"
              autocomplete="off"
              :type="passwordType"
              placeholder="密码"
            >
              <a-icon
                slot="prefix"
                type="lock"
                style="color:rgba(0,0,0,.25)"
              />
              <a-icon
                v-if="passwordType === 'password'"
                slot="suffix"
                type="eye"
                @click="switchPwd"
              />
              <a-icon
                v-else
                slot="suffix"
                type="eye-invisible"
                @click="switchPwd"
              />
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-checkbox
              v-decorator="[
                'autologin',
                {
                  valuePropName: 'checked',
                  initialValue: true,
                }
              ]"
            >
              自动登录
            </a-checkbox>
            <a
              class="login-form-forgot"
              href=""
            >
              忘记密码
            </a>
            <a-button
              type="primary"
              block
              @click="handleLogin"
            >
              登录
            </a-button>
          </a-form-item>
        </a-tab-pane>
      </a-tabs>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      form: this.$form.createForm(this),
      tabStyle: {
        display: 'flex',
        'justify-content': 'center',
      },
      passwordType: 'password',
    };
  },

  mounted() {
  },
  methods: {
    switchPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },

    handleLogin(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$store.dispatch('user/login', values).then(() => {
            this.$router.push({ path: '/' }); // 登录成功之后重定向到首页
          }).catch((error) => {
            this.$message.error(error); // 登录失败提示错误
          });
        }
      });
    },
  },
};
</script>

<style lang="scss">
$bg: #fff;

.login-container {
  min-height: 100%;
  width: 100%;
  background: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 340px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    .logo-container {
      font-size: 26px;
      color: #333;
      margin: 0 auto 20px auto;
      text-align: center;
      font-weight: 700;
    }

    .ant-tabs-tab {
      $padding: 20px;
      padding-left: $padding;
      padding-right: $padding;
    }

    .login-form-forgot {
      float: right;
    }
  }
}
</style>
