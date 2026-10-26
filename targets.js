"use strict";
/* ---- Catalog (heights in cm). approximate = typical value, not a fixed standard. ---- */
const CATEGORIES = [["people","People"],["vehicles","Vehicles"],["household","Household"],["street","Street"],["sports","Sports"]];
const TARGETS = [
  {id:"adult-male",name:"Adult male (average)",category:"people",heightCm:175.3,approximate:true,note:"US adult male mean stature, CDC NHANES 2015-2018"},
  {id:"adult-female",name:"Adult female (average)",category:"people",heightCm:161.3,approximate:true,note:"US adult female mean stature, CDC NHANES 2015-2018"},
  {id:"sedan",name:"Sedan",category:"vehicles",heightCm:145,approximate:true,note:"Typical roof height"},
  {id:"suv",name:"SUV",category:"vehicles",heightCm:170,approximate:true,note:"Typical roof height"},
  {id:"minivan",name:"Minivan",category:"vehicles",heightCm:175,approximate:true,note:"Typical roof height"},
  {id:"pickup",name:"Pickup truck",category:"vehicles",heightCm:190,approximate:true,note:"Typical full-size cab height"},
  {id:"license-plate",name:"License plate (US)",category:"vehicles",heightCm:15.2,approximate:false,note:"6 in standard plate height"},
  {id:"interior-door",name:"Door",category:"household",heightCm:203.2,approximate:false,note:"80 in standard door height"},
  {id:"garage-door-single",name:"Garage door (single)",category:"household",heightCm:213.4,approximate:true,note:"7 ft common height"},
  {id:"trash-cart",name:"Wheeled trash cart",category:"household",heightCm:107,approximate:true,note:"Approx. 96-gal cart; varies by maker"},
  {id:"fence-4ft",name:"Fence (4 ft)",category:"household",heightCm:121.9,approximate:true,note:"Nominal height"},
  {id:"fence-6ft",name:"Privacy fence (6 ft)",category:"household",heightCm:182.9,approximate:true,note:"Nominal height"},
  {id:"stop-sign",name:"Stop sign face",category:"street",heightCm:76.2,approximate:false,note:"30 in octagon, MUTCD conventional road size"},
  {id:"traffic-cone",name:"Traffic cone",category:"street",heightCm:71.1,approximate:true,note:"28 in common size"},
  {id:"uspsa-target",name:"USPSA target (full size)",category:"sports",heightCm:76,approximate:false,note:"Cardboard silhouette, about 30 in tall by 18 in wide"},
  {id:"hoop-rim",name:"Basketball rim height",category:"sports",heightCm:304.8,approximate:false,note:"10 ft regulation"},
  {id:"backboard",name:"Basketball backboard",category:"sports",heightCm:106.7,approximate:true,note:"42 in regulation height"}
];
