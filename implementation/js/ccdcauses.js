
// Update info box to user's selection
function updateInfo(selection) {
    var text;
    switch(selection) {
        case "pesticides":
            text = "Usage of a certain class of pesticides known as neonicotinoids has been linked to Colony Collapse Disorder. Honeybees have been observed to have" +
                "decreased memory and foraging capabilities when subjected to these chemicals in a laboratory setting, and neonicotinoids see use in many staple crops such" +
                "as corn. While results are not conclusive, many policymakers and scientists alike point to neonicotinoids as a likely contributor to CCD and various governments" +
                "have sought to limit or ban the usage of the substances.";
            break;
        case "pests":
            text = "The growing prevalence of honeybee pests, especially the varroa mite, is suspected to contribute to colony loss as a whole and potentially CCD itself. In recent years" +
                "bee colonies have been under assault by not only these mites but various other bee parasites and diseases, ranging from beetles and wax moths to fungal and bacterial infections." +
                "Many of these afflictions are not new and have existed long before the onset of CCD, but resistance to treatment has made some of them harder to deal with and may be compounding" +
                "the issue. ";
            break;
        case "climate":
            text = "Some cite climate change as a potential culprit for CCD. Climate has direct effects on both bee behavior and their main food source, flowers. Extreme weather events can severely hamper" +
                "foraging efforts as bees combat flooding due to rain and extreme heat, as well as more individual effects like reduced flight ability. More subtle, " +
                "gradual changes in climate can result in changing growth and flowering periods of many crops that bees frequent for sustenance." +
                "The effects of climate change are however difficult to measure in the time that CCD has become prevalent, and thus more effort has been going towards exploring causes" +
                "like pesticide usage.";
            break;
        case "humans":
            text = "Humanty";
            break;
    }
    document.getElementById("ccd-cause-info").innerHTML = "<p>" + text + "</p>";

    if (selection === "pesticides") {
        // Make neonic use bar chart
    }
}