const Code = require("../models/codeModel");
const { hashCode } = require("./hashCode");
const userWho = require("./userWho");
const User = require("../models/userModel");
const Badge = require("../models/badgeModel");

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

async function incScore(currentUser, lang) {
  // console.log("incrementing score for lang:", lang)
  try {
    lang === "python"? await User.updateOne({ _id: currentUser?.id }, { $inc: { pyScore: 20 } }) : await User.updateOne({ _id: currentUser?.id }, { $inc: { sqlScore: 20 } })
  } catch (error) {
    return error;
  }
}

async function assignBadge(currentUser, lang) {
  // console.log("assigning badge for lang:", lang)
  try {
    const foundUser = await User.findOne({ _id: currentUser?.id });
    // check if userScore >= badgeScore is a already assigned
    const userScore = lang === "python" ? foundUser?.pyScore : foundUser?.sqlScore
    // console.log(userScore)
    const foundBadges = await Badge.find({ score: { $lte:  userScore}, lang });
    // console.log("foundbadges:",foundBadges[0]);
    if (foundBadges?.length > 0) {
      // console.log("badges found")
      const not_assigned_ones = foundBadges.filter(
        (badge) => !foundUser?.badges?.includes(badge)
      );
      // console.log(not_assigned_ones)
      not_assigned_ones.map(
        async (badge) =>
          await User.updateOne(
            { _id: currentUser?.id },
            { $push: { badges: badge?._id } }
          )
      );
      // console.log(updated)
    }
    return foundBadges;
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
      // console.log("created code", newRec, "for", payload)
      await User.updateOne(
        { _id: currentUser?.id },
        { $push: { successExec: newRec._id } }
      );
      incScore(currentUser, lang);
      incTotal(currentUser)
        .then((res) => {
          assignBadge(currentUser, lang);
        })
        .catch((err) => {
          return err;
        });
    }
    return {
      msg: "Success",
    };
  } catch (error) {
    return error;
  }
}

async function incError(IDETOKEN, lang) {
  // console.log("incrementing error....");

  try {
    const currentUser = await userWho(IDETOKEN);
    const ErrorExec = lang === "python" ? {errorExecPy: 1}: {errorExecSql: 1}
    await User.updateOne({ _id: currentUser?.id }, { $inc: ErrorExec });
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
