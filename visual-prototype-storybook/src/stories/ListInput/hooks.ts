import { useMemo } from 'react'
import { useLocale } from '../LocaleProvider'
import { ListInputText, UseListInputTextParams } from './types'

export const useListInputText = ({
    value,
    validationResult,
    listInputEntries,
    listInputDuplicates,
    getEntryTypeText,
    textOverrides,
}: UseListInputTextParams): ListInputText => {
    const { t } = useLocale()

    return useMemo(() => {
        const dict = {
            list: {
                title: textOverrides.list?.title?.(getEntryTypeText(100))
                    || t('listInput.listDialogTitle', {
                        type: getEntryTypeText(100)
                    }),
                textInputHelperText: textOverrides.list?.textInputHelperText
                    || t('listInput.listInputHelper'),
                clearButtonTooltipTitle: textOverrides.list?.clearButtonTooltipTitle
                    || t('listInput.clearList'),
                nowOnListText: textOverrides.list?.nowOnListText?.(listInputEntries.length)
                    || t('listInput.nowOnList', {
                        count: listInputEntries.length
                    }),
                duplicatesText: textOverrides.list?.duplicatesText?.(listInputDuplicates.length)
                    || t('listInput.duplicates', {
                        count: listInputDuplicates.length
                    }),
                cancelButtonText: textOverrides.list?.cancelButtonText
                    || t('listInput.cancel'),
                applyButtonText: textOverrides.list?.applyButtonText
                    || t('listInput.apply'),
            },
            validation: {
                title: textOverrides.validation?.title
                    || t('listInput.validationDialogTitle'),
                errorText: textOverrides.validation?.errorText
                    || t('listInput.validationError'),
                progressText: textOverrides.validation?.progressText
                    || t('listInput.validateProcess'),
                addedText: textOverrides.validation?.addedText?.(validationResult.correct.length, getEntryTypeText(validationResult.correct.length))
                    || t('listInput.added', {
                        type: getEntryTypeText(validationResult.correct.length),
                        count: validationResult.correct.length
                    }),
                notAddedText: textOverrides.validation?.notAddedText?.(validationResult.incorrect.length, getEntryTypeText(validationResult.incorrect.length))
                    || t('listInput.notAdded', {
                        type: getEntryTypeText(validationResult.incorrect.length),
                        count: validationResult.incorrect.length
                    }),
                showNotAddedButtonText: textOverrides.validation?.showNotAddedButtonText
                    || t('listInput.showNotAdded'),
                backButtonText: textOverrides.validation?.backButtonText
                    || t('listInput.back'),
                abortButtonText: textOverrides.validation?.abortButtonText
                    || t('listInput.abort'),
                closeButtonText: textOverrides.validation?.closeButtonText
                    || t('listInput.close'),
            },
            postProcessing: {
                title: textOverrides.postProcessing?.title?.(getEntryTypeText(100))
                    || t('listInput.postProcessingDialogTitle', {
                        type: getEntryTypeText(100),
                    }),
                alreadyAddedTitle: textOverrides.postProcessing?.alreadyAddedTitle?.(value.length)
                    || t('listInput.postProcessingDialogAlreadyAddedTitle', {
                        count: value.length
                    }),
                notValidText: textOverrides.postProcessing?.notValidText?.(validationResult.incorrect.length, getEntryTypeText(validationResult.incorrect.length))
                    || t('listInput.notValid', {
                        type: getEntryTypeText(validationResult.incorrect.length),
                        count: validationResult.incorrect.length
                    }),
                nowOnListText: textOverrides.postProcessing?.nowOnListText?.(listInputEntries.length)
                    || t('listInput.nowOnList', {
                        count: listInputEntries.length
                    }),
                duplicatesText: textOverrides.postProcessing?.duplicatesText?.(listInputDuplicates.length)
                    || t('listInput.duplicates',{
                        count: listInputDuplicates.length
                    } ),
                cancelButtonText: textOverrides.postProcessing?.cancelButtonText
                    || t('listInput.cancel'),
                addButtonText: textOverrides.postProcessing?.addButtonText
                    || t('listInput.add'),
            },
            selected: textOverrides.selected?.(value.length)
                || t('listInput.selected', {
                    count: value.length
                }),
        }

        return dict
    },
    [
        value,
        validationResult,
        listInputEntries,
        listInputDuplicates,
        getEntryTypeText,
        textOverrides,
    ])
}
