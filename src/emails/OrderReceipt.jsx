import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
  Row,
  Column,
  Img,
  Hr,
} from "@react-email/components";

export default function OrderReceiptEmail({ order }) {
  const address = JSON.parse(order.shippingAddress || '{}');

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={headerTitle}>My E-Shop</Text>
          </Section>

          <Section style={content}>
            <Text style={heading}>Thank you for your order!</Text>
            <Text style={text}>
              Hi {address.firstName}, we've received your order <strong>#{order.id.slice(-8).toUpperCase()}</strong> and we're getting it ready for shipment.
            </Text>

            <Hr style={hr} />

            <Text style={subheading}>Order Summary</Text>
            {order.orderItems.map((item) => (
              <Row key={item.id} style={itemRow}>
                <Column style={itemImageCol}>
                  <Img src={item.image} alt={item.name} width="50" height="50" style={image} />
                </Column>
                <Column style={itemDetailsCol}>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemQty}>Qty: {item.qty}</Text>
                </Column>
                <Column style={itemPriceCol}>
                  <Text style={itemPrice}>${(Number(item.price) * item.qty).toFixed(2)}</Text>
                </Column>
              </Row>
            ))}

            <Hr style={hr} />

            <Row style={totalRow}>
              <Column><Text style={totalLabel}>Subtotal</Text></Column>
              <Column><Text style={totalValue}>${Number(order.itemsPrice).toFixed(2)}</Text></Column>
            </Row>
            <Row style={totalRow}>
              <Column><Text style={totalLabel}>Shipping</Text></Column>
              <Column><Text style={totalValue}>${Number(order.shippingPrice).toFixed(2)}</Text></Column>
            </Row>
            <Row style={totalRow}>
              <Column><Text style={totalLabel}>Tax</Text></Column>
              <Column><Text style={totalValue}>${Number(order.taxPrice).toFixed(2)}</Text></Column>
            </Row>
            
            <Section style={finalTotalSection}>
              <Row>
                <Column><Text style={finalTotalLabel}>Total</Text></Column>
                <Column><Text style={finalTotalValue}>${Number(order.totalPrice).toFixed(2)}</Text></Column>
              </Row>
            </Section>

            <Section style={addressSection}>
              <Text style={subheading}>Shipping To:</Text>
              <Text style={addressText}>
                {address.firstName} {address.lastName}<br />
                {address.address}<br />
                {address.city}, {address.zip}<br />
                {address.country}
              </Text>
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              If you have any questions, reply to this email or contact us at support@myeshop.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styling Objects for HTML Email (Inline CSS is required for emails)
const main = { backgroundColor: "#f6f9fc", fontFamily: "sans-serif" };
const container = { backgroundColor: "#ffffff", margin: "0 auto", padding: "20px 0 48px", marginBottom: "64px" };
const header = { padding: "24px", textAlign: "center", backgroundColor: "#000000" };
const headerTitle = { color: "#ffffff", fontSize: "24px", fontWeight: "bold", margin: "0" };
const content = { padding: "24px 32px" };
const heading = { fontSize: "24px", fontWeight: "bold", color: "#333", margin: "16px 0" };
const text = { fontSize: "16px", color: "#555", lineHeight: "24px" };
const hr = { borderColor: "#e6ebf1", margin: "20px 0" };
const subheading = { fontSize: "18px", fontWeight: "bold", color: "#333", margin: "0 0 16px" };
const itemRow = { padding: "8px 0" };
const itemImageCol = { width: "60px" };
const image = { borderRadius: "8px" };
const itemDetailsCol = { paddingLeft: "16px" };
const itemName = { fontSize: "14px", fontWeight: "500", color: "#333", margin: "0" };
const itemQty = { fontSize: "12px", color: "#777", margin: "4px 0 0" };
const itemPriceCol = { textAlign: "right", verticalAlign: "top" };
const itemPrice = { fontSize: "14px", fontWeight: "500", color: "#333", margin: "0" };
const totalRow = { padding: "4px 0" };
const totalLabel = { fontSize: "14px", color: "#555", margin: "0" };
const totalValue = { fontSize: "14px", color: "#333", textAlign: "right", margin: "0" };
const finalTotalSection = { marginTop: "16px", paddingTop: "16px", borderTop: "2px solid #e6ebf1" };
const finalTotalLabel = { fontSize: "18px", fontWeight: "bold", color: "#333", margin: "0" };
const finalTotalValue = { fontSize: "20px", fontWeight: "bold", color: "#333", textAlign: "right", margin: "0" };
const addressSection = { marginTop: "32px", padding: "16px", backgroundColor: "#f9fafb", borderRadius: "8px" };
const addressText = { fontSize: "14px", color: "#555", lineHeight: "20px", margin: "0" };
const footer = { padding: "0 32px", textAlign: "center" };
const footerText = { fontSize: "12px", color: "#8898aa" };