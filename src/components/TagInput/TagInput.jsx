import FormFieldset from "../FormFieldset";
import getTags from "../../services/getTags";
import { useEffect, useState } from "react";
import TagInputStyle from "../../assets/css/TagInput.css"



function TagInput({tags, onChange}) {
    const [recommendTags, setRecommendTags] = useState([]);
    const [currentFocus, setCurrentFocus] = useState(-1);
    const [tagList, setTagList] = useState([]);
    const [selectedTags, setSelectedTag] = useState(tags);

    useEffect(() => {

        getTags()
            .then(setTagList)
            .catch(console.error);

        setSelectedTag(tags)
    }, [tags]);



    const tagsInputHandler = (e) => {
        const value = e.target.value;

        let recommendTagsTemp = [];

        tagList.forEach(tag => {
            if (tag.substr(0, value.length).toUpperCase() === value.toUpperCase()) {
                recommendTagsTemp.push(tag)
            }
        })
        setRecommendTags(recommendTagsTemp);
    };

    const getNextFocusGoUp = (currentFocus) => {
       if(currentFocus < 0) {
           return 0;
       }

       return currentFocus - 1;
    }

    const getNextFocusGoDown = (currentFocus) => {
        if(currentFocus >= recommendTags.length) {
            return 0;
        }

        return currentFocus + 1;
    }

    const keydownHandler = (e) => {
        if (e.keyCode === 40) {
            setCurrentFocus(getNextFocusGoDown(currentFocus));
        } else if (e.keyCode === 38) { //up
            setCurrentFocus(getNextFocusGoUp(currentFocus));
        } else if (e.keyCode === 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                tags.push(recommendTags[currentFocus])
                closeRecommendTagList()
            }
        } else if (e.keyCode === 27) {
            closeRecommendTagList()
        }

    }

    const recommendTagsOnClick = (e, item) => {
        tags.push(item)
        closeRecommendTagList()
    };

    const closeRecommendTagList = () => {
        setRecommendTags([])
    }

    const focusClass = (itemIndex) => {
        if(currentFocus === itemIndex) {
            return "autocomplete-active";
        }

        return "";
    }


    const tagElementList = recommendTags.map((item, index) =>
        (

        <div key={item}
             className={focusClass(index)}
             onClick={event => recommendTagsOnClick(event,item)}>
            {item}
        </div>

        )
    )

    const closeTag = (event, index) => {
        event.target.parentElement.remove();
        let newTags = [];
        tags.forEach((item, loopIndex) => {
            if(loopIndex !== index) {
                newTags.push(item);
            }
        });
        tags = newTags;
    }

    return (
        <>
            <FormFieldset
                normal
                placeholder="Enter tags"
                name="tagsInputForRecommend"
                handler={tagsInputHandler}
                keydownHandler={keydownHandler}
                type="text"
            >
                <div className="tag-list">
                    <div id="autocomplete-list" className="autocomplete-items">
                        {tagElementList}
                    </div>
                </div>

            </FormFieldset>

            <ul className="tags-input">
            {tags.map((item, index) =>
                    (<li key={item} >{item}<span className="close" onClick={event => closeTag(event, index)}>x</span></li>)
                )}
            </ul>

            <FormFieldset
                normal
                placeholder="Enter tags"
                name="tagsInput"
                value={tags}
                type="hidden"
                handler={onChange}
            >


            </FormFieldset>
        </>
    );
}

export default TagInput;