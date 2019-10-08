import React, { Component } from "react";
import PropTypes from "prop-types";
import { typeImages } from "../styleConstants";

const shopItemStyle = {
	backgroundColor: "green",
	position: "relative",
	width: "23%",
	paddingTop: "23%",
	margin: "1%",
	float: "left",
	backgroundSize: "100% 100%",
	backgroundRepeat: "no-repeat"
};

class ShopItem extends Component {
	render() {
		return (
			<div
				style={{
					...shopItemStyle,
					...typeImages[this.props.shopItem.shopItemTypeId]
				}}
				onClick={event => {
					event.preventDefault();
					this.props.refund(this.props.shopItem);
					event.stopPropagation();
				}}
			/>
		);
	}
}

ShopItem.propTypes = {
	refund: PropTypes.func.isRequired,
	shopItem: PropTypes.object.isRequired
};

export default ShopItem;
