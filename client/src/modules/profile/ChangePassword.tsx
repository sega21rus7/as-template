import React from "react";
import { Form, Input, Button, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { passRules } from "modules/auth/rules";
import { jsonFetch } from "tools";
import { IKeyStringValueString } from "tools/interfaces";

const ChangePassword: React.FC = () => {
  const changePass = async (values: IKeyStringValueString) => {
    if (values.password1 !== values.password2) {
      return message.error("Пароли должны совпадать!");
    }
    try {
      const res = await jsonFetch("/api/profile/change_password", values);
      message.success(res);
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <div>
      <Form
        onFinish={changePass}
      >
        <Form.Item
          name="old_password"
          rules={passRules}
        >
          <Input.Password
            prefix={<LockOutlined />}
            autoComplete="on"
            placeholder="Старый пароль"
          />
        </Form.Item>
        <Form.Item
          name="password1"
          rules={passRules}
        >
          <Input.Password
            prefix={<LockOutlined />}
            autoComplete="on"
            placeholder="Новый пароль"
          />
        </Form.Item>
        <Form.Item
          name="password2"
          rules={passRules}
        >
          <Input.Password
            prefix={<LockOutlined />}
            autoComplete="on"
            placeholder="Подтвердите новый пароль"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 5 }}>
            Изменить
          </Button>
        </Form.Item>
      </Form >
    </div>
  );
};

export default ChangePassword;