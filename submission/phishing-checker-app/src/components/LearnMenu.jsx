import * as React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';

import {
	ArrowDropDown
} from '@mui/icons-material';
import { Link } from 'react-router';


function LearnMenu() {
	// Generate a unique id to recognise the button and menu by
	const id = React.useId();
	const buttonId = `${id}-button`;
	const menuId = `${id}-menu`;

	// Setup anchor element variable and function.
	// The anchor element is to the menu that appears knows which element
	// to anchor itself to.
	const [anchorElement, setAnchorElement] = React.useState(null);
	const is_open = Boolean(anchorElement);

	// Event handlers
	const handleClick = (event) => {
		setAnchorElement(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorElement(null);
	};

	return (
		<div>
			<Button
				id={buttonId}	// Assign ID
				aria-controls={is_open ? menuId : undefined}	// Accessibility
				aria-haspopup="true"
				aria-expanded={is_open}
				onClick={handleClick}
				color='inherit'
				disableRipple
			>
				Learn
				<ArrowDropDown />
			</Button>

			

			<Menu
				id={menuId}	// Assign ID
				anchorEl={anchorElement}	// Tell the dropdown which element to anchor itself to (the button)
				open={is_open}
				onClose={handleClose}
				// More accessibility stuff, gives each menu item the property 'aria-labelledby', telling assistive technologies
				// that the menu's accessibility ID comes from the button
				slotProps={{
					list: {
						'aria-labelledby': buttonId,
					},
				}}
			>
				<MenuItem
					onClick={handleClose}
					component={Link}
					to="/about-the-tool"
				>
					About the tool
				</MenuItem>

				<MenuItem
					onClick={handleClose}
					component={Link}
					to="/about-phishing"
				>
					About phishing
				</MenuItem>
			</Menu>
		</div>
	);
}

export default LearnMenu;