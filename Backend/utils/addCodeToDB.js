const Code = require("../models/codeModel");
const { hashCode } = require("./hashCode");
const userWho = require("./userWho");
const User = require("../models/userModel");

async function incTotal(currentUser) {
  // console.log("incrementing total....");
  try {
    await User.updateOne({ _id: currentUser?.id }, { $inc: { totalExec: 1 } });
    return {
      msg: "success",
    };
  } catch (error) {
    return error;
  }
}

async function addCodetoDB(code, lang, IDETOKEN) {
  try {
    // get user
    const currentUser = await userWho(IDETOKEN);
    // console.log(currentUser)
    const cleanedCode = code
      .replace(/# BEGIN_INPUT_PATCH[\s\S]*?# END_INPUT_PATCH\n?/g || "", "")
      .replace(/# BEGIN_DS_PATCH[\s\S]*?# END_DS_PATCH\n?/g || "", "")
      .trim();
    // check code similarity before adding the code
    const hash = hashCode(cleanedCode);
    const payload = {
      code: cleanedCode,
      owner: currentUser?.id,
      hash,
      lang,
    };

    const DBcode = await Code.find({ hash, owner: currentUser?.id });
    // console.log(DBcode)
    if (DBcode.length === 0) {
      const newRec = await Code.create(payload);
      await User.updateOne(
        { _id: currentUser?.id },
        { $push: { successExec: newRec._id } }
      );
      incTotal(currentUser);
    }
    return {
      msg: "Success",
    };
  } catch (error) {
    return error;
  }
}

async function incError(IDETOKEN) {
  // console.log("incrementing error....");

  try {
    const currentUser = await userWho(IDETOKEN);
    await User.updateOne({ _id: currentUser?.id }, { $inc: { errorExec: 1 } });
    incTotal(currentUser);
    // add score for failed execution
    return {
      msg: "success",
    };
  } catch (error) {
    return error;
  }
}

module.exports = {
  addCodetoDB,
  incError,
  incTotal,
};
