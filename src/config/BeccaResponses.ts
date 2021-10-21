import { BeccaLyria } from "../interfaces/BeccaLyria";

export const BeccaColours: BeccaLyria["colours"] = {
  default: 0x8b4283,
  success: 0x1f8b4c,
  warning: 0xc27c0e,
  error: 0x992d22,
};

export const BeccaPhrases: BeccaLyria["responses"] = {
  missingGuild: [
    "It seems I cannot locate your guild record.",
    "Are you sure that guild actually exists?",
    "Well that's odd... your guild does not seem to be in my archives.",
  ],
  invalidCommand: [
    "I am not sure how this happened, but that spell does not appear to be valid.",
    "Well that's awkward - I don't actually know that spell.",
    "Hmm... I have not heard of that spell before.",
  ],
  noPermission: [
    "You do not have the correct skills to use this spell.",
    "I am afraid I cannot allow you to do that.",
    "Maybe one day you can use this spell. Today is not the day.",
  ],
  ownerOnly: [
    "Only nhcarrigan can ask me to do this.",
    "There is only one person special enough to use this spell. It's not you.",
    "Yeah, I don't think so. This spell isn't meant for you.",
  ],
  missingParam: [
    "This is impressive. You have managed to forget a required component for this spell.",
    "It does not seem like you have the necessary reagents to cast this.",
    "Oh dear, you've misplaced the scrolls we need for this spell.",
  ],
  defaultModReason: [
    "Unfortunately, they could not be bothered to tell me why.",
    "It seems they were far too busy to bother with a reason.",
    "Since they did not provide a reason, I am tempted to make one up.",
  ],
  noModBecca: [
    "Brave of you to try to make me your target. Foolish, but brave.",
    "How dare you try to turn on me? You shall regret this.",
    "Excuse me? Who do you think you are?",
  ],
  noModSelf: [
    "Are... are you asking me to smite you? That's weird.",
    "I try not to judge people's requests, but yours is especially strange.",
    "I punish you on my terms, not yours. And I don't feel like doing so today.",
  ],
};

export const BeccaSass: BeccaLyria["sass"] = {
  greeting: [
    "Well, I *was* having a good time. Unfortunate.",
    "Oh, are we finally important enough for you to grace us with your presence?",
    "Look who decided to show up. It sure took you long enough. Did you get lost?",
  ],
  amirite: [
    "I'm almost certain you're not, but to be fair, I wasn't listening.",
    "You? Right? The chances of that happening are lower than the chances of me failing.",
    "Highly doubtful. But I suppose there's a first time for everything.",
  ],
  sorry: [
    "Oh, did you just apologise? About time.",
    "What exactly are you sorry for? I'm sure it's a long list.",
    "You can apologise all you want - I doubt you'll get forgiveness.",
  ],
  selfthanks: [
    "I suppose you need a pat on the back badly enough to thank yourself.",
    "Well, if no one else is thanking you, I suppose saying it to yourself has to work.",
    "Huh. There's narcissism, and then there's you.",
  ],
  beccathanks: [
    "You are quite welcome. But do not expect my constant help.",
    "You know, for all I do around here that is not even *close* to enough gratitude.",
    "Wow, it's about time you said thanks. Too little too late.",
  ],
};
