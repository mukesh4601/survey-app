import React, { PureComponent } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./welcome.css";
class welcome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onFinish = (values) => {
    sessionStorage.setItem("PlayValue", values);
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-4 offset-md-4 md100">
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={() => this.onFinish()}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Name !" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Name"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "EmailID !" }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="email"
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Let's Play
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default welcome;
