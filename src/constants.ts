import discord from './img/discord.svg'
// import facebook from "src/img/social/fb.svg";
// import instagram from "src/img/social/inst.svg";
// import medium from "src/img/social/medium.svg";
// import site from "src/img/social/site.svg";
import telegram from './img/tg.svg'
import twitter from './img/tw.svg'
// import vk from "src/img/social/vk.svg";

export const defaultLink = '/'

type Social = {
  key: string
  icon: string
  link: string
}
export const social: Social[] = [
  // {
  //   key: "site",
  //   icon: site,
  //   link: defaultLink,
  // },
  // {
  //   key: "facebook",
  //   icon: facebook,
  //   link: defaultLink,
  // },
  // {
  //   key: "instagram",
  //   icon: instagram,
  //   link: defaultLink,
  // },
  {
    key: 'twitter',
    icon: twitter,
    link: 'https://twitter.com/VenomFoundation',
  },
  {
    key: 'discord',
    icon: discord,
    link: 'https://discord.gg/KuMJaqh3WV',
  },
  {
    key: 'telegram',
    icon: telegram,
    link: 'https://t.me/VenomFoundationOfficial',
  },
  // {
  //   key: "medium",
  //   icon: medium,
  //   link: defaultLink,
  // },
  // {
  //   key: "vk",
  //   icon: vk,
  //   link: defaultLink,
  // },
]

export const links: Record<string, string> = {
  developerDiscordChannel: 'https://discord.gg/E7k433tZv2',
  policy: 'https://venom.foundation/policy.html',
  terms: 'https://venom.foundation/terms.html',
}
