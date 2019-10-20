import Connection from "../loaders/mysql.js"

import Authorization from "../library/authorization"

const returnData = {};

const getInstitutions = async () => {
  const queryString1 = `
    SELECT 
    id,
    api_id,
    institution_id,
    name,
    shortname,
    login_id_caption,
    password_caption
    FROM 
    institutions
  `;

  try {
    const [results, fields] = await Connection.query(queryString1)

    returnData.status = {
      code: 200,
      error: ``,
      message: ``
    };
    returnData.data = results;
    return (returnData);
  } catch (err) {
    console.log(err)
    returnData.status = {
      code: 500,
      error: err,
      message: `Internal server error.`
    };
    return (returnData);
  }
};

const getInstitutionsByUser = async (req) => {
  const userId = req.user.id

  const queryString1 = `
    SELECT 
    users_has_institution.user_id as userId,
    institutions.id,
    institutions.api_id,
    institutions.institution_id,
    institutions.name,
    institutions.shortname,
    institutions.login_id_caption,
    institutions.password_caption
    FROM users_has_institution
    JOIN institutions ON institutions.id = users_has_institution.institution_id
    WHERE users_has_institution.user_id = ?
  `;

  try {
    const [results, fields] = await Connection.query(queryString1, [userId])

    if (!Authorization.authorize(results, userId)) {
      returnData.status = Authorization.defaultUnauthMsg();
      return (returnData);
    }

    returnData.status = {
      code: 200,
      error: ``,
      message: ``
    };
    returnData.data = results;
    return (returnData);
  } catch (err) {
    console.log(err)
    returnData.status = {
      code: 500,
      error: err,
      message: `Internal server error.`
    };
    return (returnData);
  }
};

const saveInstitutions = async (apiId, institutions) => {
  const queryString1 = `
    INSERT INTO institutions
    (
      api_id,
      institution_id, 
      name, 
      shortname, 
      country, 
      login_id_caption, 
      password_caption
    )
    VALUES
    (
      ?,
      ?, 
      ?, 
      ?, 
      ?, 
      ?, 
      ?
    )
    ON DUPLICATE KEY UPDATE institution_id= ?`;

  for (let i = 0; i < institutions.length; i++) {
    const institution = institutions[i];

    const institutionId = institution.id;
    const institutionName = institution.name;
    const institutionShortName = institution.shortName;
    const institutionCounty = institution.country;
    const institutionLoginIdCaption = institution.loginIdCaption;
    const institutionPasswordCaption = institution.passwordCaption;

    try {
      const [results, fields] = await Connection.query(
        queryString1,
        [
          apiId,
          institutionId,
          institutionName,
          institutionShortName,
          institutionCounty,
          institutionLoginIdCaption,
          institutionPasswordCaption,
          institutionId
        ]
      )

      if (!Authorization.authorize(results, userId)) {
        returnData.status = Authorization.defaultUnauthMsg();
        return (returnData);
      }

      returnData.status = {
        code: 200,
        error: ``,
        message: ``
      };
      returnData.data = results;
      return (returnData);
    } catch (err) {
      console.log(err)
      returnData.status = {
        code: 500,
        error: err,
        message: `Internal server error.`
      };
      return (returnData);
    }
  }
};

const InstitutionModel = {
  saveInstitutions: saveInstitutions,
  getInstitutions: getInstitutions,
  getInstitutionsByUser: getInstitutionsByUser
};

export default InstitutionModel;
