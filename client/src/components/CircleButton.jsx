import React from 'react';
import PropTypes from 'prop-types';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import Tooltip from 'material-ui/internal/Tooltip';

export class CircleButton extends React.PureComponent {
	static propTypes = {
		className: PropTypes.string,
		icon: PropTypes.string.isRequired, // fontawesome
		mini: PropTypes.bool,
		tooltip: PropTypes.string,
		tooltipPosition: PropTypes.oneOf(['bottom-center', 'top-center', 'bottom-right', 'top-right', 'bottom-left', 'top-left']),
		onClick: PropTypes.func
	};

	static defaultProps = {
		mini: true,
		tooltipPosition: 'top-center'
	};

	state = {
		hovered: false
	};

	render() {
		const { className, icon, mini, tooltip, tooltipPosition, onClick } = this.props;
		const tooltipPos = tooltipPosition.split('-');

		return (
			<div style={{ position: 'relative' }} className={className}>
				<FloatingActionButton
					mini={mini}
					onClick={onClick}
					onMouseEnter={() => this.setState({ hovered: true })}
					onMouseLeave={() => this.setState({ hovered: false })}>
					<FontIcon
						style={{ fontSize: '14pt' }}
						className={`fa fa-${icon}`}/>
				</FloatingActionButton>
				{tooltip &&
					<Tooltip
						show={this.state.hovered}
						label={tooltip}
						style={{ fontSize: '9pt' }}
						horizontalPosition={tooltipPos[1]}
						verticalPosition={tooltipPos[0]}/>
				}
			</div>
		);
	}
}
