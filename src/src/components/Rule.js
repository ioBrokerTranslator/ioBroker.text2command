import React, {
    useCallback,
    useState,
    useEffect,
} from 'react';
import { makeStyles } from '@mui/styles';

import { Draggable } from 'react-beautiful-dnd';

import PropTypes from 'prop-types';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';

import { Utils, I18n } from '@iobroker/adapter-react-v5';

import EditIcon from '@mui/icons-material/Edit';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MaximizeIcon from '@mui/icons-material/Maximize';
import FileCopy from '@mui/icons-material/FileCopy';

const Rule = React.forwardRef(props => {
    const {
        name,
        handleEdit,
        handleCopy,
        rule,
        // isDragging,
        id,
        selectRule,
        selectedRule,
        _break,
        matchingRules,
        unsavedRules,
        index,
        theme,
        removeMatched,
        words,
        unique,
    } = props;

    const classes = makeStyles({
        listItem: {
            cursor: 'pointer',
            transition: 'background-color 0.3s linear',
            position: 'relative',
            paddingTop: 4,
            paddingBottom: 12,
            borderBottom: `1px dashed ${theme.palette.text.primary}${theme.palette.text.primary.startsWith('rgb') ? '' : '30'}`,
        },
        listItemText: {
        },
        listItemTextPrimary: {
            color: theme.palette.text.primary,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
        },
        listItemTextSecondary: {
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            opacity: theme.palette.mode === 'dark' ? 0.2 : 0.7,
            fontStyle: 'italic',
        },
        dot: {
            position: 'absolute',
            backgroundColor: 'red',
            top: 3,
            right: 15,
            height: 10,
            fontSize: 10,
            borderRadius: 10,
            padding: '0 5px 5px 5px',
            textAlign: 'center',
            color: '#FFF',
        },
        maximize: {
            color: theme.palette.error?.dark,
            marginTop: theme.spacing(1),
        },
        ruleButton: {
            paddingTop: theme.spacing(1.5),
        },
        editButton: {
            height: 32,
        },
        words: {
            fontSize: 12,
            opacity: 0.5,
            width: 'calc(100% - 40px)',
            position: 'absolute',
            bottom: 4,
            left: 0,
            paddingLeft: 17,
            color: theme.palette.text.primary,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        emptyButton: {
            width: 30,
        },
        multiline: {
            marginTop: 0,
            marginBottom: 12,
        },
    })();

    const selectRuleMemo = useCallback(() => selectRule(id), [id, selectRule]);
    const handleEditMemo = useCallback(() => handleEdit(id), [id, handleEdit]);
    const handleCopyMemo = useCallback(() => handleCopy(id), [id, handleCopy]);

    const [ruleStyle, setRuleStyle] = useState({});

    useEffect(() => {
        if (matchingRules.length) {
            const matchingRule = matchingRules.find(item => item.indexOf === index);
            if (matchingRule) {
                setTimeout(() => setRuleStyle({ backgroundColor: theme.palette.mode === 'dark' ? theme?.palette?.secondary.dark : theme?.palette?.secondary.light }), matchingRule.timer);

                setTimeout(() => {
                    setRuleStyle(selectedRule.id === id ? { backgroundColor: theme?.palette?.background?.default } : {});
                    if (_break || index === matchingRules[matchingRules.length - 1].indexOf) {
                        removeMatched();
                    }
                }, 1500 * (matchingRule.index + 1));
            } // only when matching rules have been changed
        } // eslint-disable-next-line
    }, [matchingRules]);

    const secondary = rule !== name ? rule || '' : '';

    return <Draggable key={id} draggableId={id} index={index}>
        {(provided/* , snapshot */) => (<div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={({ ...provided.draggableProps.style, ...ruleStyle })}
        >
            <ListItem
                onClick={selectRuleMemo}
                selected={selectedRule?.id === id}
                className={Utils.clsx(selectedRule?.id === id && 'rule-selected')}
                classes={{ root: classes.listItem }}
            >
                <ListItemText
                    primary={name}
                    secondary={secondary}
                    classes={{
                        primary: classes.listItemTextPrimary,
                        secondary: classes.listItemTextSecondary,
                        multiline: classes.multiline,
                    }}
                    className={classes.listItemText}
                />
                <ListItemIcon>
                    {
                        _break ?
                            <Tooltip title={I18n.t('Interrupt processing')}>
                                <MaximizeIcon className={Utils.clsx(classes.ruleButton, classes.maximize)} />
                            </Tooltip>
                            :
                            <Tooltip title={I18n.t('Do not interrupt processing')}><ArrowDownwardIcon className={classes.ruleButton} color="primary" /></Tooltip>
                    }
                    {!unique ? <Tooltip title={I18n.t('Copy rule')}>
                        <IconButton onClick={handleCopyMemo} size="small" className={classes.editButton}>
                            <FileCopy />
                        </IconButton>
                    </Tooltip> : <div className={classes.emptyButton} />}
                    <Tooltip title={I18n.t('Edit name or type of rule')}>
                        <IconButton onClick={handleEditMemo} size="small" className={classes.editButton}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                </ListItemIcon>
                {unsavedRules[id] && <div className={classes.dot}>{I18n.t('unsaved')}</div>}
                <div className={classes.words}>
[
                    {words}
]
                </div>
            </ListItem>
        </div>
        )}
    </Draggable>;
});

export default Rule;

Rule.propTypes = {
    removeRule: PropTypes.func,
    name: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    //    isDragging: PropTypes.bool,
    connectDropTarget: PropTypes.func,
    connectDragTarget: PropTypes.func,
    _break: PropTypes.bool.isRequired,
    selectRule: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    matchingRules: PropTypes.array,
    unique: PropTypes.bool,
    selectedRule: PropTypes.shape({ id: PropTypes.string }),
    unsavedRules: PropTypes.object,
};
