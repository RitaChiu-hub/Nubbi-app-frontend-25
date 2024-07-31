import * as React from "react";
import {
  View,
  Text,
  ScrollView,
} from "react-native";
import { globalStyles } from "../../styles/global";

export default function TermsScreen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Terms of Service</Text>
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
        <Text style={globalStyles.headingText}>NUUBI TERMS OF USE</Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          Last Updated: December 29, 2023
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          Hello! Thank you for using Nuubi Inc’s app. Nuubi Inc {"("}“Nuubi,”
          “we,” “us,” or “our,”{")"} is a corporation that operates the mobile
          and web app Nuubi {"("}
          www.nuubi.app{")"} {"("}“App”{")"}. The following Terms of Use are a
          contract between you, the user {"("}“user,” “you,” or “your”{")"}, and
          Nuubi regarding the use of the App and services provided therein.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>
          Acceptance of these Terms.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          Read the terms of service below carefully. By registering for an
          account, accessing the App, browsing or otherwise using the App and
          any associated content you agree and are acknowledging that you have
          read, understood and have agreed to be bound by the following Terms of
          Use written below. The Terms of Use are collectively referred to as
          the “Terms” throughout.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>TABLE OF CONTENTS</Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          1. Accessing the App; Account Security.
        </Text>
        <Text style={globalStyles.bodyRegular}>2. User Accounts.</Text>
        <Text style={globalStyles.bodyRegular}>3. Privacy Policy.</Text>
        <Text style={globalStyles.bodyRegular}>
          4. Modification of the Terms
        </Text>
        <Text style={globalStyles.bodyRegular}>
          5. Intellectual Property Rights.
        </Text>
        <Text style={globalStyles.bodyRegular}>
          6. User Posts and Uploads.
        </Text>
        <Text style={globalStyles.bodyRegular}>7. Purchase License Grant</Text>
        <Text style={globalStyles.bodyRegular}>8. Item Pricing.</Text>
        <Text style={globalStyles.bodyRegular}>
          9. Digital Millennium Copyright Act.
        </Text>
        <Text style={globalStyles.bodyRegular}>10. Prohibited Conduct.</Text>
        <Text style={globalStyles.bodyRegular}>
          11. Third-Party Sites, Products, Plugins, and Services; Links.
        </Text>
        <Text style={globalStyles.bodyRegular}>12. Term and Termination.</Text>
        <Text style={globalStyles.bodyRegular}>13. Indemnification.</Text>
        <Text style={globalStyles.bodyRegular}>
          14. Disclaimers; No Warranties.
        </Text>
        <Text style={globalStyles.bodyRegular}>
          15. Limitation of Liability and Damages.
        </Text>
        <Text style={globalStyles.bodyRegular}>16. Arbitration.</Text>
        <Text style={globalStyles.bodyRegular}>17. Entire Agreement.</Text>
        <Text style={globalStyles.bodyRegular}>18. Governing Law.</Text>
        <Text style={globalStyles.bodyRegular}>19. Severability</Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>
          1. Accessing the App; Account Security.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          At our sole discretion we may withdraw or amend this App and any
          portion of it without notice. We are not liable to you if any part of
          the App becomes unavailable. We may restrict access to some parts of
          the App, or the entire App, to users, including registered users.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>2. User Accounts.</Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          Some content may only be available to users who create an account. In
          order to create an account on our App, an email address, a username
          that will be visible to the public, and a password to protect your
          account. Additional information may be requested. You represent that
          all the information you provide is true and accurate to the best of
          your knowledge. Should your personal information change, you agree to
          promptly update your account. You agree not to share your account
          details with any third parties. If you choose to do so, you are
          responsible for what happens to your account. Should your account be
          accessed without authorization you agree to notify us immediately. We
          have the right to disable any account at any time for any or no
          reason, including if, in our opinion, you have violated any provision
          of these Terms to include violating the copyright of third parties.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>3. Privacy Policy. </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          Your privacy is important to us. Our Privacy Policy discuss what types
          of information we collect, what it is used for, and how its protected.
          The Privacy Policy is available on this app.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>
          4. Modification of the Terms.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          When you register for an account, access the App, browse or otherwise
          use our App or any associated content, you agree to the Terms posted
          on the App. We reserve the right to change, modify, add, or remove
          portions of the Terms at our sole discretion. Any change we make is
          immediately effective upon posting. Your continued use after we make
          changes to the Terms serves as your binding acceptance. You agree that
          you will periodically check the Terms for changes made after you
          register for an account or otherwise use the App. If at any time you
          do not agree with the Terms, you must discontinue your use. If we make
          any significant changes to the Terms, we will attempt to notify you of
          those changes.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>
          5. Intellectual Property Rights.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          Nuubi’s App, its entire contents, features, and functionality are
          owned by Nuubi, its licensors, or other providers of such material and
          are protected by United States and international copyright, trademark,
          patent, trade secret, and other intellectual property or proprietary
          rights laws. As the user, you are permitted to use this App for your
          non-commercial personal use. Any content that is available for your
          use on this App may have an accompanying trademark, copyright, or
          other proprietary right included. You may not delete or alter those
          rights. Any right not expressly granted to you in these Terms are
          reserved by Nuubi.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>
          6. User Posts and Uploads.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          As part of the function of the App, users are permitted to upload
          content between them and other users. When you post something to
          Nuubi’s App you are representing and warranting that you have the
          necessary rights, licenses, consents, or other permissions to
          reproduce and publish your User Posts and Uploads. Nuubi does not own
          the content you post. You acknowledge that you are responsible for the
          posts and uploads you submit, and you, not Nuubi, have full
          responsibility for such content, including its legality, reliability,
          accuracy, and appropriateness
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          By posting content to the App, you grant Nuubi a worldwide,
          non-exclusive, royalty-free, sublicensable and transferable license to
          use the content you upload (including to reproduce, distribute,
          prepare derivative works, display and perform it) in connection with
          the Service and Nuubi’s (and its successors’ and Affiliates’)
          business, including for the purpose of promoting and redistributing
          part or all of the Service and your content. We have the right to
          remove any user post or upload for any and all reasons including
          violating these terms.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          We have the right to cooperate fully with any law enforcement
          authorities or court order requesting or directing us to disclose the
          identity or other information of anyone posting any materials on or
          through our App.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          YOU WAIVE AND HOLD HARMLESS NUUBI AND ITS AFFILIATES, LICENSEES, AND
          ANY OTHER SERVICE PROVIDER WE WORK WITH FROM ANY CLAIMS STEMMING FROM
          ANY ACTION TAKEN BY NUUBI DURING INVESTIGATIONS BY EITHER NUUBI OR ANY
          LAW ENFORCEMENT AUTHORITIES.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          We do not undertake to review user posts and uploads before they are
          posted for distribution on our App. For this reason, we cannot ensure
          prompt removal of objectionable material after it has been posted.
          Accordingly, we assume no liability for any action or inaction
          regarding transmissions, communications, or content provided by any
          User of the App.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>
          7. Digital Millennium Copyright Act.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          As the User of Nuubi, you agree to use this App only within the bounds
          of these Terms and agree not to do the following:{" "}
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          1. Use this App for any unlawful purpose that would be a violation of
          federal, state, local, or international law or regulation.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          2. Transmit, upload, install, or otherwise infect the App or any
          content contained thereon with any virus or malicious programing or
          attacks (including but not limited to, denial of service attacks,
          trojan horses, worms, logic bombs, or any other harmful material or
          process) advertisement, or other communication that effects either the
          use and enjoyment of the site, or the servers or property of Nuubi.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          3. Post, upload, or distribute any defamatory, libelous, or inaccurate
          content;
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          4. Post obscene, harassing, defamatory, filthy, violent, pornographic,
          abusive, threatening, objectionable or illegal material on the Site.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          5. Post a communication that advocates or encourages criminal conduct
          or conduct that may give rise to civil liability.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          6. Allow persons under 18 to access the site via your account.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          7. Impersonate or attempt to impersonate Nuubi, one of our employees
          or contractors, any other user or person.{" "}
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          8. Otherwise interfere with the proper function of this App.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>
          11. Third-Party Sites, Products and Services; Links.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          The Services may include links or references to other Apps not owned
          or otherwise operated, endorsed, or maintained by Nuubi solely as a
          convenience to Users. Nuubi does not endorse or guarantee the
          information, materials, products, or services contained on or
          accessible through any linked sites. Accessing these linked sites is
          done solely at your own risk.{" "}
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>
          12. Term and Termination.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          The Terms shall remain in effect while you use the site and other
          services unless you terminate your account, or it is otherwise
          terminated by us. In the event of termination, you no longer have the
          right to use this site and its services. You can terminate your
          account at anytime by deleting your account. Nuubi may terminate your
          account for violation of these terms at any time after the violation
          occurs. Repeat copyright offender accounts will be terminated.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>13. Indemnification.</Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          To the extent permitted by applicable law, you agree to defend,
          indemnify, and hold harmless Nuubi Inc, its Affiliates, officers,
          directors, employees, and agents against any and all claims, damages,
          obligations, losses, liabilities, costs, debts, and expenses
          (including but not limited to attorney’s fees) arising from: i{")"}{" "}
          your use of and access of Nuubi’s app and related services; ii{")"}
          your violation of any of these Terms iii{")"} your violation of any
          third party right, including without limitation any copyright,
          property, or privacy right; or iv{")"} any claim that your user posts
          or uploads caused damage to a third party. This defense and
          indemnification obligation will survive this Agreement and your use of
          Nuubi’s App and related services.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>
          14. Disclaimers; No Warranties.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          You understand that we cannot and do not guarantee or warrant that
          files available for downloading and purchase from our App, and the
          internet in general, will be free of viruses or other harmful or
          destructive code. You are responsible for implementing sufficient
          procedures and checkpoints to satisfy your own requirements for virus
          protection and online security.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          TO THE FULLEST EXTENT PROVIDED BY LAW, NUUBI WILL NOT BE LIABLE FOR
          ANY LOSS OR DAMAGE CAUSED BY ANY TECHNOLOGICALLY HARMFUL MATERIAL THAT
          MAY INFECT YOUR COMPUTER, PROGRAMS, DATA, OR OTHER PROPRIETARY
          MATERIAL DUE TO YOUR USE OF THE APP OR ANY SERVICES OR ITEMS OBTAINED
          THROUGH THE APP OR TO YOUR DOWNLOADING OF ANY MATERIAL POSTED ON IT,
          OR ON ANY WEBSITE LINKED TO IT.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          YOU USE AT YOUR OWN RISK OUR APP, CONTENT, AND ANY SERVICES OR ITEMS
          OBTAINED THROUGH THEM. OUR APP, CONTENT, AND ALL SERVICES OR ITEMS
          OBTAINED THROUGH THEM ARE PROVIDED “AS IS”, WITHOUT ANY WARRANTIES OF
          ANY KIND (EXPRESS, IMPLIED, OR OTHERWISE) INCLUDING, WITHOUT
          LIMITATION, ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, AND NON-INFRINGEMENT, EXCEPT INSOFAR AS ANY SUCH
          IMPLIED WARRANTIES MAY NOT BE DISCLAIMED UNDER APPLICABLE LAW.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          NEITHER NUUBI NOR ANY PERSON ASSOCIATED WITH US MAKES ANY WARRANTY OR
          REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY,
          RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY OF THE APP. NEITHER
          THE COMPANY NOR ANYONE ASSOCIATED WITH THE COMPANY REPRESENTS OR
          WARRANTS THAT THE APP, ITS CONTENT, OR ANY SERVICES OR ITEMS OBTAINED
          THROUGH THE APP WILL BE:
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          1. ACCURATE, RELIABLE, ERROR-FREE, OR UNINTERRUPTED,{" "}
        </Text>
        <Text style={globalStyles.bodyRegular}>
          2. THAT DEFECTS WILL BE CORRECTED,{" "}
        </Text>
        <Text style={globalStyles.bodyRegular}>
          3. THAT OUR SITE OR THE SERVER THAT MAKES IT AVAILABLE ARE FREE OF
          VIRUSES OR OTHER HARMFUL COMPONENTS.{" "}
        </Text>
        <Text style={globalStyles.bodyRegular}>
          4. THAT THE APP OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE APP WILL
          OTHERWISE MEET YOUR NEEDS OR EXPECTATIONS.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>
          15. Limitations of Liability and Damages.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          TO THE FULLEST EXTENT PROVIDED BY LAW, IN NO EVENT WILL NUUBI OR ITS
          AFFILIATES, THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS,
          OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY
          LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR
          INABILITY TO USE, THE APP, ANY WEBSITES LINKED TO IT, ANY CONTENT ON
          THE APP OR SUCH OTHER WEBSITES, INCLUDING ANY DIRECT, INDIRECT,
          SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT
          NOT LIMITED TO, PERSONAL INJURY, PAIN AND SUFFERING, EMOTIONAL
          DISTRESS, LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR
          ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF GOODWILL, LOSS OF DATA, AND
          WHETHER CAUSED BY TORT {"("}INCLUDING NEGLIGENCE{")"}, BREACH OF
          CONTRACT, OR OTHERWISE, EVEN IF FORESEEABLE
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>16. Arbitration.</Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          You agree that any dispute arising from these Terms shall be resolved
          by confidential arbitration. The confidential arbitration shall be
          held via telephone, unless the arbitrator requests in-person
          arbitration. Should in-person arbitration be required, it shall be
          held in Phoenix, Arizona. The decision of the arbitrator shall be
          binding. The arbitrator may, but is not required, to award attorney’s
          fees and cost to the prevailing party. Arbitration shall be conducted
          according to the rules prescribed by the American Arbitration
          Association.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>17. Entire Agreement.</Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          These Terms constitute the entirety of the Agreement between you and
          Nuubi.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>18. Governing Law.</Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          These Terms are governed by the law of the State of Arizona, without
          regard to any conflict of laws principles to the contrary.
        </Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.headingText}>19. Severability.</Text>
        <View style={{ margin: 5 }}></View>
        <Text style={globalStyles.bodyRegular}>
          If any portion of these Terms are determined invalid or inoperative,
          that provision shall be severed from the Terms to the minimum extent
          necessary and the remainder are valid and enforceable. No portion of
          these Terms can be amended.
        </Text>
        <View style={{ margin: 15 }}></View>
      </View>
    </ScrollView>
  );
}
