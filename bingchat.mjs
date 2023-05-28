import { BingChat } from 'bing-chat'

async function example(a, re, count, datal, isr, answers) {
  const api = new BingChat({
    cookie:'1EAh2w8zogYqb8BUrZyWjlI7GmGQyUz_Ob6-MrL3ng5MQJnHpSggtSvGBwdLWMpmHSY4ahHZxpSsGXz8tnrmD5pneIbh18unfLNxbLkKhQE6apAdhcAhdQvQo-28xUC8I1SwF4yoI792tqYu8SKzyfGENgywbd-nxba7i_u_G3k_wWSzO18hpK3z-G-imjZX7UQjiBH-3YodbdtszD4HXBgqbNf24mHZoyfLudzigBcg'
  })

  const res = await api.sendMessage("Hey, I took an exam and i missed these questions { " +a+" } can you explain the answers and tell me in which topics i have to focus!")
  console.log(res, 1);
  console.log(res.detail.sourceAttributions, 2);
  console.log(res.detail.adaptiveCards, 3);
  console.log(res.detail.suggestedResponses, 3);
  re.json({count : count, datal : datal, isr : isr, answers : answers, txtresp : res.text, sources : res.detail.sourceAttributions});

}
export { example };