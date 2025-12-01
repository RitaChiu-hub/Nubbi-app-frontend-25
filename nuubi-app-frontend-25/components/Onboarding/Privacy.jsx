import * as React from "react";
import { View, Text, ScrollView } from "react-native";
import { globalStyles } from "../../styles/global";

export default function PrivacyScreen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Privacy Policy</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView
      style={{
        backgroundColor: "#fbfbfb",
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          backgroundColor: "#fbfbfb",
          margin: 16,
        }}
      >
        <Text style={globalStyles.bodyRegular}>
          Protecting your private information is our priority. This Statement of
          Privacy applies to Nuubi and Nuubi Inc {"("}www.nuubi.com{")"} and
          governs data collection and usage. For the purposes of this Privacy
          Policy, unless otherwise noted, all references to Nuubi Inc. include
          www.nuubi.com and Nuubi. The Nuubi application is an eLearning and
          social media platform. Nuubi operates on SOC 2‑certified managed
          servers {"("}DigitalOcean for data storage, Vercel for web hosting
          {")"} and uses industry‑standard AES‑256 encryption at rest and
          TLS 1.2+ in transit. By using Nuubi, you consent to the data practices
          described in this statement.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={[globalStyles.headingText]}>Security Overview</Text>
        <View style={{ margin: 5 }}></View>
        <Text style={[globalStyles.bodyRegular, { marginVertical: 8 }]}>
          • <Text style={{ fontWeight: "600" }}>Encryption:</Text> All data is
          encrypted at rest (AES‑256) and in transit (TLS 1.2+).{"\n"}•{" "}
          <Text style={{ fontWeight: "600" }}>SOC 2 Certified:</Text>
          Our infrastructure undergoes regular third‑party audits.{"\n"}•{" "}
          <Text style={{ fontWeight: "600" }}>Data Minimization:</Text>
          We only collect what’s necessary—email, username, and participation
          metrics.{"\n"}•{" "}
          <Text style={{ fontWeight: "600" }}>No Marketing Sharing:</Text>
          We never sell or rent personal data; integrations {"("}Canvas, email
          {")"} are governed by strict confidentiality agreements.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>
          Collection of your Personal Information
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          In order to better provide you with products and services offered,
          Nuubi may collect personally identifiable information, such as your:
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>- First and Last Name</Text>
        <Text style={globalStyles.bodyRegular}>- E-mail Address</Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          Nuubi may also collect anonymous demographic information, which is not
          unique to you, such as your:
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>- Age</Text>
        <Text style={globalStyles.bodyRegular}>- Gender</Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>
          Device Identifiers and Technical Information
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          Nuubi and its integrated third-party services (such as analytics or
          crash reporting providers) may collect technical information from your
          device. This may include unique device identifiers such as your
          Android ID, MAC address, or advertising ID. These identifiers are used
          for purposes such as enabling core functionality, monitoring app
          performance, and improving the overall user experience.
        </Text>

        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          We do not collect any personal information about you unless you
          voluntarily provide it to us. However, you may be required to provide
          certain personal information to us when you elect to use certain
          products or services. These may include: (a) registering for an
          account; (b) entering a sweepstakes or contest sponsored by us or one
          of our partners; (c) signing up for special offers from selected third
          parties; (d) sending us an email message; (e) submitting your credit
          card or other payment information when ordering and purchasing
          products and services. To wit, we will use your information for, but
          not limited to, communicating with you in relation to services and/or
          products you have requested from us. We also may gather additional
          personal or non-personal information in the future.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>
          Use of your Personal Information
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          Nuubi collects and uses your personal information to operate and
          deliver the services you have requested. Nuubi may also use your
          personally identifiable information to inform you of other products or
          services available from Nuubi and its affiliates.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>
          Sharing Information with Third Parties
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          Nuubi does not sell, rent or lease its customer lists to third
          parties. Nuubi may, from time to time, contact you on behalf of
          external business partners about a particular offering that may be of
          interest to you. In those cases, your unique personally identifiable
          information (e-mail, name, address, telephone number) is not
          transferred to the third party. Nuubi may share data with trusted
          partners to help perform statistical analysis, send you email or
          postal mail, provide customer support, or arrange for deliveries. All
          such third parties are prohibited from using your personal information
          except to provide these services to Nuubi, and they are required to
          maintain the confidentiality of your information. Nuubi may disclose
          your personal information, without notice, if required to do so by law
          or in the good faith belief that such action is necessary to: (a)
          conform to the edicts of the law or comply with legal process served
          on Nuubi or the site; (b) protect and defend the rights or property of
          Nuubi; and/or (c) act under exigent circumstances to protect the
          personal safety of users of Nuubi, or the public.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>Right to Deletion</Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          Subject to certain exceptions set out below, on receipt of a
          verifiable request from you, we will:
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          • Delete your personal information from our records; and
        </Text>
        <Text style={globalStyles.bodyRegular}>
          • Direct any service providers to delete your personal information
          from their records.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          Please note that we may not be able to comply with requests to delete
          your personal information if it is necessary to:
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          • Complete the transaction for which the personal information was
          collected, fulfill the terms of a written warranty or product recall
          conducted in accordance with federal law, provide a good or service
          requested by you, or reasonably anticipated within the context of our
          ongoing business relationship with you, or otherwise perform a
          contract between you and us;
        </Text>
        <Text style={globalStyles.bodyRegular}>
          • Detect security incidents, protect against malicious, deceptive,
          fraudulent, or illegal activity; or prosecute those responsible for
          that activity;
        </Text>
        <Text style={globalStyles.bodyRegular}>
          • Debug to identify and repair errors that impair existing intended
          functionality;
        </Text>
        <Text style={globalStyles.bodyRegular}>
          • Exercise free speech, ensure the right of another consumer to
          exercise his or her right of free speech, or exercise another right
          provided for by law;
        </Text>
        <Text style={globalStyles.bodyRegular}>
          • Comply with the California Electronic Communications Privacy Act;
        </Text>
        <Text style={globalStyles.bodyRegular}>
          • Engage in public or peer-reviewed scientific, historical, or
          statistical research in the public interest that adheres to all other
          applicable ethics and privacy laws, when our deletion of the
          information is likely to render impossible or seriously impair the
          achievement of such research, provided we have obtained your informed
          consent;
        </Text>
        <Text style={globalStyles.bodyRegular}>
          • Enable solely internal uses that are reasonably aligned with your
          expectations based on your relationship with us;
        </Text>
        <Text style={globalStyles.bodyRegular}>
          • Comply with an existing legal obligation; or
        </Text>
        <Text style={globalStyles.bodyRegular}>
          • Otherwise use your personal information, internally, in a lawful
          manner that is compatible with the context in which you provided the
          information.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>Children Under Thirteen</Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          Nuubi does not knowingly collect personally identifiable information
          from children under the age of thirteen. If you are under the age of
          thirteen, you must ask your parent or guardian for permission to use
          this application.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>E-mail Communications</Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          From time to time, Nuubi may contact you via email for the purpose of
          providing announcements, promotional offers, alerts, confirmations,
          surveys, and/or other general communication. If you would like to stop
          receiving marketing or promotional communications via email from
          Nuubi, you may opt out of such communications by Clicking on the
          "unsubscribe" button at the bottom of each email.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>Changes to this Statement</Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          Nuubi reserves the right to change this Privacy Policy from time to
          time. We will notify you about significant changes in the way we treat
          personal information by sending a notice to the primary email address
          specified in your account, by placing a prominent notice on our
          application, and/or by updating any privacy information. Your
          continued use of the application and/or Services available after such
          modifications will constitute your: (a) acknowledgment of the modified
          Privacy Policy; and (b) agreement to abide and be bound by that
          Policy.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>Contact Information</Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          Nuubi welcomes your questions or comments regarding this Statement of
          Privacy. If you believe that Nuubi has not adhered to this Statement,
          please contact Nuubi at:
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          Nuubi Inc, 252 NW 29th St, 9th Floor Miami, Florida 33127
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          Email Address: support@nuubi.com
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          Telephone number: +1 813-489-9249
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          Effective as of August 01, 2023
        </Text>
        <View style={{ margin: 15 }}></View>
      </View>
    </ScrollView>
  );
}
