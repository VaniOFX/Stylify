var facts = [
    "In the United States, each person owns an average of seven pairs of blue jeans. That’s one for every day of the week!",
"Men have been wearing shorts for decades, but women were only allowed to wear them in public after World War II. One of the main reasons for this was because less fabric was available during the war, so shorts were more cost-effective than pants or skirts.",
"The T-shirt is one of the most popular items of clothing in the world, and around two billion of them are sold every single year.",
"Historically, purple clothes were only worn by magistrates, emperors and other aristocracy in Rome, Italy.",
"The loincloth is the oldest item of clothing, but the second oldest is the skirt – an item which is still very popular today.",
"Thousands of fashion magazines are sold every year, but the first ever fashion magazine was sold in Germany in 1586.",
"While lots of things are increasing in price, clothing is actually decreasing. Since 1992, the price of clothes has gone down by 8.5%.",
"In 1907, a woman was arrested on a beach in Boston for wearing a one-piece swimsuit.",
"Bras have been through different styles over the years, but you can now purchase a bra that can also be used as a gas mask.",
"On the subject of bras, the famous author Mark Twain (who wrote The Adventures of Tom Sawyer) was the inventor of the bra clasp."]

function getNumber(max){
    return Math.floor(Math.random() * (max - 1))
}

function generateFacts() {
    var fact1 = getNumber(facts.length);
    var fact2 = getNumber(facts.length);
    while(fact1 == fact2){
        fact2 = getNumber(facts.length);
    }
    el("fact1").innerHTML = facts[fact1]
    el("fact2").innerHTML = facts[fact2]
}

$(document).ready(generateFacts());