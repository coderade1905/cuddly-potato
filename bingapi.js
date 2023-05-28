const request = require('./await-request');
module.exports = async (a) =>
{
  const options = {
    method: 'POST',
    url: 'https://chatgpt-4-bing-ai-chat-api.p.rapidapi.com/chatgpt-4-bing-ai-chat-api/0.2/send-message/',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': '614e741485msh3fc01db3f2fc941p1293eajsnd273d5eb6a5a',
      'X-RapidAPI-Host': 'chatgpt-4-bing-ai-chat-api.p.rapidapi.com'
    },
    form: {
      bing_u_cookie: '1ay-ajp3QEdK3g47fj-Qatb3SKzTvbfmLusT18u5AYGlnAV2i4cjSVlguIt7vMDg1gVuX8nX87aPMNxnqKZ7EFggTC7EkRG-xUlI9MdssfVwBLcFvDuRoUL0pUMtCAOKAHHmXEEulbHY-abevu98kZY9ZXM9GJtDmgS7EvuIquK3v445QK2UUuqAlt3TqlAflFUjV_kHwFxnRcwoxqbbSmmbIIkQCXcLwvAopare4iPA',
      question: "Hey, I took an exam and i missed these questions { " +a+" } can you explain the answers and tell me in which topics i have to focus!"
    }
  };
      try {
        const result = await request(options)
        console.log(result)
        return result
      }
      catch (err) {
          console.error(err)
      }
}
/*
const options = {
  method: 'POST',
  url: 'https://chatgpt-4-bing-ai-chat-api.p.rapidapi.com/chatgpt-4-bing-ai-chat-api/0.2/send-message/',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'X-RapidAPI-Key': '614e741485msh3fc01db3f2fc941p1293eajsnd273d5eb6a5a',
    'X-RapidAPI-Host': 'chatgpt-4-bing-ai-chat-api.p.rapidapi.com'
  },
  form: {
    bing_u_cookie: '1ay-ajp3QEdK3g47fj-Qatb3SKzTvbfmLusT18u5AYGlnAV2i4cjSVlguIt7vMDg1gVuX8nX87aPMNxnqKZ7EFggTC7EkRG-xUlI9MdssfVwBLcFvDuRoUL0pUMtCAOKAHHmXEEulbHY-abevu98kZY9ZXM9GJtDmgS7EvuIquK3v445QK2UUuqAlt3TqlAflFUjV_kHwFxnRcwoxqbbSmmbIIkQCXcLwvAopare4iPA',
    question: 'Give me 3 examples of how I can use you.'
  }
};

request(options, function (error, response, body) {
	if (error) throw new Error(error);

	console.log(body);
});
*/