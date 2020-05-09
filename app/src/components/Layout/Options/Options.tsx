import React, { useContext, useMemo, useRef } from 'react';
import { Modal, Form, Select, Radio, Slider } from 'antd';
import { getNames, alpha2ToAlpha3B } from '@cospired/i18n-iso-languages';
import { OptionsCtx } from '../../../features/options';

interface Props {
    visible?: boolean
    onClose?: () => void
}

const marks = {
    192000: '144p',
    400000: '360p',
    1000001: '720p',
    4000002: '1080p',
    40000001: '4K'
};

function getQuality(bitrate: number):string {
    const mapping = Object.entries(marks);
    for (let i = 0; mapping[i] && mapping[i + 1]; i++) {
        if (bitrate >= parseInt(mapping[i][0], 10) && bitrate < parseInt(mapping[i + 1][0], 10)) {
            return mapping[i][1];
        }
    }
    return Object.values(marks).pop() || '';
}

function prettyPrintBitrate(bitrate: number):string {
    if (bitrate < 1000) {
        return `${bitrate.toString()} bps`;
    } else if (bitrate < 1000 * 1000) {
        return `${(bitrate / 1000).toFixed(0)} kbps`;
    } else {
        return `${(bitrate / (1000 * 1000)).toFixed(0)} mbps`;
    }
}

export function Options({ visible = true, onClose }: Props) {
    const countryList = useMemo(() => getNames("en"), []);
    const formElem = useRef(null);
    const { options } = useContext(OptionsCtx);

    return (
        <Modal
            title="Options"
            visible={visible}
            onCancel={() => {
                if (onClose) {
                    onClose();
                }
            }}
            onOk={() => {
                // @ts-ignore
                console.log(formElem.current?.getFieldsValue())
            }}
        >
            <Form
                ref={formElem}
                initialValues={options.getOpt()}
            >
                <Form.Item
                    label="Default audio language"
                    name="defaultAudioLanguage"
                >
                    <Select showSearch>
                        {
                            Object.entries(countryList).map(([k, v]) => {
                                return <Select.Option key={k} value={alpha2ToAlpha3B(k)}>{v}</Select.Option>;
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Default subtitle mode"
                    name="defaultSubType"
                >
                    <Radio.Group>
                        <Radio value={0}>None</Radio>
                        <Radio value={1}>Forced</Radio>
                        <Radio value={2}>Complete</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label="Default subtitle language"
                    name="defaultSubLanguage"
                >
                    <Select showSearch>
                        {
                            Object.entries(countryList).map(([k, v]) => {
                                return <Select.Option key={k} value={alpha2ToAlpha3B(k)}>{v}</Select.Option>;
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Maximum bitrate"
                    name="maxBitrate"
                >
                    <Slider
                        min={192*1000}
                        max={60*1000*1000}
                        tipFormatter={value => (`${getQuality(value)} - ${prettyPrintBitrate(value)}`)}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
