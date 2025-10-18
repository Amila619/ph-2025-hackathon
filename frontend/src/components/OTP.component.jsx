import { Flex, Input, Typography } from 'antd';

const { Title } = Typography;

const OTPComponent = ({onChange}) => {

  const sharedProps = {
    onChange,
    autoFocus: true
};

  return (
    <Flex gap="middle" align="flex-start" vertical>
      
      <Title level={5}>Enter OTP here:</Title>
      <Input.OTP length={8} {...sharedProps} />
      
    </Flex>
  );
};

export default OTPComponent;