
function getToken()
{
    let token= sessionStorage.getItem('apitoken');
    return token;
}
function setToken(token)
{
    token="Bearer "+token;
    sessionStorage.removeItem('apitoken')
    sessionStorage.setItem('apitoken',token);
}
function testToken()
{
   let res='api/com>testToken'
   return res
}
export default{
    getToken,setToken,testToken
}