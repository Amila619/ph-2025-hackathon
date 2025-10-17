import { Card } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";

const Footer = () => {
    return (
        <Card style={{ width: 300 }} variant="borderless">
            <Paragraph>Ready to unleash...</Paragraph>
            <Title level={2}>Let's Talk</Title>
            {/* <i class="arrows alternate icon"></i> */}
        </Card>
    );
}

export default Footer;