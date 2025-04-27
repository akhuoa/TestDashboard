class MBFImageObject {
    constructor(imageObj = {}){
        this.id = imageObj.id || "";
    }

    clone() {
        const clonedObject = new MBFImageObject();
        clonedObject.id = this.id;
        return clonedObject;
      }
}
//simplifies object for easier front end reading. 
//add anything from the dataset's FLI/metadata to this object that you want to surface
export class SparcImageObject
{
    constructor(data, packageId){ //hits.hits[n]_source.dataset, hits.hits[n]_id
      //  this.id = data.image_id; 
        this.name = data.item.name || "SPARC_Schwaber_HeartB_section39-section374.jpx"; //item.name - truncate it
        this.description = data.item? data.item.description: "Image file associated with the accompanying xml file, viewable in TissueMapper", //item.description
        this.size = (Math.random()*10).toFixed(2)+"mb",
        this.urlPath = data.distributions.current[0].uri; //path_metadata.uri_human; 
        this.sparcID = data.objectID //pennsieve.organization.identifier
        this.packageId = packageId;
        this.sex = data.attributes&& data.attributes.subject&& data.attributes.subject.sex?data.attributes.subject.sex[0].value:"unknown";
        this.ageRange = data.attributes&& data.attributes.subject&& data.attributes.subject.ageCategory?data.attributes.subject.ageCategory[0].value:"unkown";
        this.biolucidaPath = "";
    }
}
export class TableObject{
    constructor(array = {}){
        this.SparcImageArray = [];
        array.forEach((img)=>img&&img._source&&img._source.dataset?this.SparcImageArray.push(new SparcImageObject(img._source.dataset,img._id)):"")
        this.MBFImageObject = [];
        array.forEach((img)=>this.MBFImageObject.push(new MBFImageObject(img)))
    }
    buildTableMBF(){
        let _tempArr=[];
        this.MBFImageObject.forEach((img)=>{
            let column = {
                name:img.name,
                description: img.description,
                size: (Math.random()*10).toFixed(2)+"mb",
                path: ""
            }
            _tempArr.push(column);
        })
        return _tempArr;
    }

}