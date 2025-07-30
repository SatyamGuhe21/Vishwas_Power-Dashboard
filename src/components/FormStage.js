"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import "./form-styles.css"
const FormStage = ({ stage, onFormSubmit, onBack, companyData }) => {
  const [currentFormIndex, setCurrentFormIndex] = useState(0)
  const [formData, setFormData] = useState({})

  // Stage 1 Forms - Based on provided images
  const stage1Forms = [
    {
      id: "name-plate-details",
      title: "Name Plate Details Transformer",
      component: NamePlateDetailsForm,
    },
    {
      id: "protocol-accessories-checking",
      title: "Protocol for Accessories Checking",
      component: ProtocolAccessoriesForm,
    },
    {
      id: "core-insulation-check",
      title: "Core Insulation Check",
      component: CoreInsulationCheckForm,
    },
    {
      id: "pre-erection-tan-delta-test",
      title: "Pre-Erection Tan Delta and Capacitance Test on Bushing",
      component: PreErectionTanDeltaTestForm,
    },
    {
      id: "record-measurement-ir-values",
      title: "Record of Measurement of IR Values",
      component: RecordMeasurementIRValuesForm,
    },
  ]

  // Stage 2 Forms - Based on provided images
  const stage2Forms = [
    {
      id: "record-oil-handling",
      title: "Record of Oil Handling - Test Values Prior to Filteration",
      component: RecordOilHandlingForm,
    },
    {
      id: "ir-after-erection-stage2",
      title: "IR After Erection - Stage 2 End",
      component: IRAfterErectionStage2Form,
    },
  ]

  // Stage 3 Forms - Based on provided images
  const stage3Forms = [
    {
      id: "before-oil-filling-pressure-test",
      title: "Before Oil Filling and Pressure Test Report",
      component: BeforeOilFillingPressureTestForm,
    },
    {
      id: "record-oil-filtration-main-tank",
      title: "Record for Oil Filtration - Main Tank",
      component: RecordOilFiltrationMainTankForm,
    },
    {
      id: "oil-filtration-radiator-combine",
      title: "Oil Filtration of Radiator and Combine",
      component: OilFiltrationRadiatorCombineForm,
    },
  ]

  // Stage 4 Forms - Based on provided images
  const stage4Forms = [
    {
      id: "sfra-test-record",
      title: "SFRA Test Record",
      component: SFRATestRecordForm,
    },
    {
      id: "ir-voltage-ratio-magnetising-test",
      title: "Record of Measurement of IR Values & Voltage Ratio Test",
      component: IRVoltageRatioMagnetisingTestForm,
    },
    {
      id: "short-circuit-test",
      title: "Short Circuit Test",
      component: ShortCircuitTestForm,
    },
    {
      id: "winding-resistance-ir-pi-test",
      title: "Winding Resistance Test and Record of Measurement of IR & PI Values",
      component: WindingResistanceIRPITestForm,
    },
  ]

  // Stage 5 Forms - Based on provided images
  const stage5Forms = [
    {
      id: "pre-charging-checklist",
      title: "Pre-Charging Check List",
      component: PreChargingChecklistForm,
    },
    {
      id: "pre-charging-checklist-part2",
      title: "Pre-Charging Check List - Part 2",
      component: PreChargingChecklistPart2Form,
    },
  ]

  // Stage 6 Forms - Based on provided images
  const stage6Forms = [
    {
      id: "work-completion-report",
      title: "Work Completion Report",
      component: WorkCompletionReportForm,
    },
  ]

  const getFormsForStage = (stageNumber) => {
    switch (stageNumber) {
      case 1:
        return stage1Forms
      case 2:
        return stage2Forms
      case 3:
        return stage3Forms
      case 4:
        return stage4Forms
      case 5:
        return stage5Forms
      case 6:
        return stage6Forms
      default:
        return []
    }
  }

  const currentForms = getFormsForStage(stage)
  const currentForm = currentForms[currentFormIndex]
  const isLastFormOfStage = currentFormIndex === currentForms.length - 1

  const handleFormSubmit = (data) => {
    const updatedFormData = { ...formData, [currentForm.id]: data }
    setFormData(updatedFormData)

    if (currentFormIndex < currentForms.length - 1) {
      setCurrentFormIndex(currentFormIndex + 1)
    } else {
      onFormSubmit(stage, updatedFormData)
    }
  }

  const handlePrevious = () => {
    if (currentFormIndex > 0) {
      setCurrentFormIndex(currentFormIndex - 1)
    }
  }

  if (!currentForm) {
    return (
      <div className="form-stage-container">
        <div className="form-header">
          <h2>Stage {stage} - No Forms Available</h2>
          <button onClick={onBack} className="back-btn">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const FormComponent = currentForm.component

  return (
    <div className="form-stage-container fade-in">
      <div className="form-header">
        <div className="form-progress">
          <h2>
            Stage {stage} - Form {currentFormIndex + 1} of {currentForms.length}
          </h2>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentFormIndex + 1) / currentForms.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <button onClick={onBack} className="back-btn">
          ← Back to Dashboard
        </button>
      </div>

      <div className="form-content">
        <h3 className="slide-in-left">{currentForm.title}</h3>
        <div className="slide-in-right">
          <FormComponent
            onSubmit={handleFormSubmit}
            onPrevious={currentFormIndex > 0 ? handlePrevious : null}
            initialData={formData[currentForm.id] || {}}
            companyData={companyData}
            isLastFormOfStage={isLastFormOfStage}
          />
        </div>
      </div>
    </div>
  )
}

// Signature Canvas Hook
const useSignatureCanvas = (initialDataUrl) => {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatureDataUrl, setSignatureDataUrl] = useState(initialDataUrl || "")
  const lastX = useRef(0)
  const lastY = useRef(0)

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setSignatureDataUrl("")
    }
  }, [])

  const getSignature = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas) {
      return canvas.toDataURL("image/png")
    }
    return ""
  }, [])

  const draw = useCallback(
    (e) => {
      if (!isDrawing) return

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      const rect = canvas.getBoundingClientRect()

      let clientX, clientY
      if (e.touches) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }

      const currentX = clientX - rect.left
      const currentY = clientY - rect.top

      ctx.beginPath()
      ctx.moveTo(lastX.current, lastY.current)
      ctx.lineTo(currentX, currentY)
      ctx.stroke()

      lastX.current = currentX
      lastY.current = currentY
    },
    [isDrawing],
  )

  const startDrawing = useCallback((e) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()

    let clientX, clientY
    if (e.touches) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    lastX.current = clientX - rect.left
    lastY.current = clientY - rect.top
    e.preventDefault()
  }, [])

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
    setSignatureDataUrl(getSignature())
  }, [getSignature])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.strokeStyle = "#000"

      if (initialDataUrl) {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = initialDataUrl
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
      }
    }
  }, [initialDataUrl])

  return { canvasRef, signatureDataUrl, clearCanvas, startDrawing, draw, stopDrawing }
}

// Photo Upload Component
const PhotoUploadSection = ({ title, photos, onPhotoChange }) => {
  return (
    <div className="photo-upload-section">
      <h4>Note: - Photographs to be added: -</h4>
      <p style={{ textAlign: "center", marginBottom: "20px", fontWeight: "600" }}>{title}</p>
      <div className="photo-upload-grid">
        {photos.map((photo, index) => (
          <div key={index} className="photo-upload-item">
            <label>{photo.label}</label>
            <input type="file" accept="image/*" onChange={(e) => onPhotoChange(photo.key, e.target.files[0])} />
          </div>
        ))}
      </div>
    </div>
  )
}

// Digital Signature Component
const DigitalSignatureSection = ({ signatures, onSignatureChange }) => {
  return (
    <div className="signature-section">
      {signatures.map((sig, index) => (
        <SignatureBox
          key={index}
          label={sig.label}
          nameValue={sig.nameValue}
          onNameChange={(value) => onSignatureChange(sig.key, "name", value)}
          onSignatureChange={(signature) => onSignatureChange(sig.key, "signature", signature)}
          initialSignature={sig.signature}
        />
      ))}
    </div>
  )
}

// Individual Signature Box Component
const SignatureBox = ({ label, nameValue, onNameChange, onSignatureChange, initialSignature }) => {
  const { canvasRef, signatureDataUrl, clearCanvas, startDrawing, draw, stopDrawing } =
    useSignatureCanvas(initialSignature)

  useEffect(() => {
    if (signatureDataUrl) {
      onSignatureChange(signatureDataUrl)
    }
  }, [signatureDataUrl, onSignatureChange])

  return (
    <div className="signature-box">
      <label>{label}</label>
      <input type="text" placeholder="Enter name" value={nameValue} onChange={(e) => onNameChange(e.target.value)} />
      <canvas
        ref={canvasRef}
        width={300}
        height={150}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <button type="button" onClick={clearCanvas} className="clear-signature-btn">
        Clear Signature
      </button>
      <small>Sign above</small>
    </div>
  )
}

// Stage 1 Form Components (keeping existing ones)

// Form 1: Name Plate Details Transformer
function NamePlateDetailsForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    make: initialData.make || "",
    currentHV: initialData.currentHV || "",
    srNo: initialData.srNo || "",
    currentLV: initialData.currentLV || "",
    mvaRating: initialData.mvaRating || "",
    tempRiseOil: initialData.tempRiseOil || "",
    hvKv: initialData.hvKv || "",
    winding: initialData.winding || "",
    lvKv: initialData.lvKv || "",
    transportingWeight: initialData.transportingWeight || "",
    impedancePercent: initialData.impedancePercent || "",
    noOfRadiators: initialData.noOfRadiators || "",
    yearOfMfg: initialData.yearOfMfg || "",
    weightCoreWinding: initialData.weightCoreWinding || "",
    oilQuantityLiter: initialData.oilQuantityLiter || "",
    totalWeight: initialData.totalWeight || "",
    photos: initialData.photos || {},
    ...initialData,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [
    { key: "transformer", label: "Transformer" },
    { key: "oilLevelGauge", label: "Oil Level Gauge" },
    { key: "wheelLocking", label: "Wheel Locking" },
    { key: "transformerFoundation", label: "Transformer Foundation Level Condition" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>NAME PLATE DETAILS TRANSFORMER</h2>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>MAKE</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              />
            </td>
            <td>
              <strong>CURRENT HV (A)</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.currentHV}
                onChange={(e) => setFormData({ ...formData, currentHV: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>SR. NO.</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.srNo}
                onChange={(e) => setFormData({ ...formData, srNo: e.target.value })}
              />
            </td>
            <td>
              <strong>LV (A)</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.currentLV}
                onChange={(e) => setFormData({ ...formData, currentLV: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>MVA Rating</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.mvaRating}
                onChange={(e) => setFormData({ ...formData, mvaRating: e.target.value })}
              />
            </td>
            <td>
              <strong>Temp. Rise over amb. In Oil °C</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.tempRiseOil}
                onChange={(e) => setFormData({ ...formData, tempRiseOil: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>HV (KV)</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.hvKv}
                onChange={(e) => setFormData({ ...formData, hvKv: e.target.value })}
              />
            </td>
            <td>
              <strong>Winding</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.winding}
                onChange={(e) => setFormData({ ...formData, winding: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>LV (KV)</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.lvKv}
                onChange={(e) => setFormData({ ...formData, lvKv: e.target.value })}
              />
            </td>
            <td>
              <strong>Transporting weight</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.transportingWeight}
                onChange={(e) => setFormData({ ...formData, transportingWeight: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>% Impedance</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.impedancePercent}
                onChange={(e) => setFormData({ ...formData, impedancePercent: e.target.value })}
              />
            </td>
            <td>
              <strong>No. Of radiators</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.noOfRadiators}
                onChange={(e) => setFormData({ ...formData, noOfRadiators: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Year of Mfg.</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.yearOfMfg}
                onChange={(e) => setFormData({ ...formData, yearOfMfg: e.target.value })}
              />
            </td>
            <td>
              <strong>Weight of Core & Winding.</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.weightCoreWinding}
                onChange={(e) => setFormData({ ...formData, weightCoreWinding: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Oil Quantity in liter</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.oilQuantityLiter}
                onChange={(e) => setFormData({ ...formData, oilQuantityLiter: e.target.value })}
              />
            </td>
            <td>
              <strong>Total Weight</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.totalWeight}
                onChange={(e) => setFormData({ ...formData, totalWeight: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection
        title="Transformer, Oil Level gauge, Wheel Locking, Transformer Foundation Level condition"
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

// Form 2: Protocol for Accessories Checking
function ProtocolAccessoriesForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    accessories: initialData.accessories || {},
    photos: initialData.photos || {},
    ...initialData,
  })

  const accessoryItems = [
    { id: 1, description: "HV bushing" },
    { id: 2, description: "LV Bushing" },
    { id: 3, description: "Neutral bushing" },
    { id: 4, description: "Buchholz" },
    { id: 5, description: "PRV" },
    { id: 6, description: "CPR" },
    { id: 7, description: "Breather" },
    { id: 8, description: "Bushing Connector" },
    { id: 9, description: "Radiators" },
  ]

  const handleAccessoryChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      accessories: {
        ...prev.accessories,
        [id]: {
          ...prev.accessories[id],
          [field]: value,
        },
      },
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [{ key: "transformerAccessories", label: "Transformer Accessories" }]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>PROTOCOL FOR ACCESSORIES CHECKING.</h2>
      </div>

      <table className="form-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Packing case Number</th>
            <th>Material Description</th>
            <th>Qty as per P. L.</th>
            <th>Qty. Received</th>
            <th>Short Qty</th>
            <th>Damaged Qty.</th>
          </tr>
        </thead>
        <tbody>
          {accessoryItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                <input
                  type="text"
                  value={formData.accessories[item.id]?.packingCase || ""}
                  onChange={(e) => handleAccessoryChange(item.id, "packingCase", e.target.value)}
                />
              </td>
              <td>
                <strong>{item.description}</strong>
              </td>
              <td>
                <input
                  type="text"
                  value={formData.accessories[item.id]?.qtyPerPL || ""}
                  onChange={(e) => handleAccessoryChange(item.id, "qtyPerPL", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData.accessories[item.id]?.qtyReceived || ""}
                  onChange={(e) => handleAccessoryChange(item.id, "qtyReceived", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData.accessories[item.id]?.shortQty || ""}
                  onChange={(e) => handleAccessoryChange(item.id, "shortQty", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData.accessories[item.id]?.damagedQty || ""}
                  onChange={(e) => handleAccessoryChange(item.id, "damagedQty", e.target.value)}
                />
              </td>
            </tr>
          ))}
          {[...Array(5)].map((_, index) => (
            <tr key={`empty-${index}`}>
              <td></td>
              <td>
                <input type="text" />
              </td>
              <td>
                <input type="text" />
              </td>
              <td>
                <input type="text" />
              </td>
              <td>
                <input type="text" />
              </td>
              <td>
                <input type="text" />
              </td>
              <td>
                <input type="text" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PhotoUploadSection
        title="Transformer Accessories"
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

// Form 3: Core Insulation Check
function CoreInsulationCheckForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    betweenCoreFrame: initialData.betweenCoreFrame || "",
    betweenCoreFrameRemarks: initialData.betweenCoreFrameRemarks || "",
    betweenFrameTank: initialData.betweenFrameTank || "",
    betweenFrameTankRemarks: initialData.betweenFrameTankRemarks || "",
    betweenCoreTank: initialData.betweenCoreTank || "",
    betweenCoreTankRemarks: initialData.betweenCoreTankRemarks || "",
    filterMachine: initialData.filterMachine || "",
    filterMachineChecked: initialData.filterMachineChecked || "",
    filterCapacity: initialData.filterCapacity || "",
    filterCapacityChecked: initialData.filterCapacityChecked || "",
    vacuumPumpCapacity: initialData.vacuumPumpCapacity || "",
    vacuumPumpCapacityChecked: initialData.vacuumPumpCapacityChecked || "",
    reservoirAvailable: initialData.reservoirAvailable || "",
    reservoirAvailableChecked: initialData.reservoirAvailableChecked || "",
    reservoirCapacity: initialData.reservoirCapacity || "",
    reservoirCapacityChecked: initialData.reservoirCapacityChecked || "",
    hosePipes: initialData.hosePipes || "",
    hosePipesChecked: initialData.hosePipesChecked || "",
    craneAvailable: initialData.craneAvailable || "",
    craneAvailableChecked: initialData.craneAvailableChecked || "",
    fireExtinguisher: initialData.fireExtinguisher || "",
    firstAidKit: initialData.firstAidKit || "",
    ppeEquipment: initialData.ppeEquipment || "",
    photos: initialData.photos || {},
    ...initialData,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [{ key: "aboveMentionedPoints", label: "Above-mentioned point" }]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>CORE INSULATION CHECK: At 1 KV {">"} 500 MΩ</h2>
      </div>

      <table className="form-table">
        <thead>
          <tr>
            <th></th>
            <th>Obtained Value MΩ</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Between Core – frame</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.betweenCoreFrame}
                onChange={(e) => setFormData({ ...formData, betweenCoreFrame: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.betweenCoreFrameRemarks}
                onChange={(e) => setFormData({ ...formData, betweenCoreFrameRemarks: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Between Frame – tank</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.betweenFrameTank}
                onChange={(e) => setFormData({ ...formData, betweenFrameTank: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.betweenFrameTankRemarks}
                onChange={(e) => setFormData({ ...formData, betweenFrameTankRemarks: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Between core – tank</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.betweenCoreTank}
                onChange={(e) => setFormData({ ...formData, betweenCoreTank: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.betweenCoreTankRemarks}
                onChange={(e) => setFormData({ ...formData, betweenCoreTankRemarks: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginTop: "40px", textAlign: "center" }}>
        CHECKLIST FOR CONFORMING AVAILABILITY OF EQUIPMENT AT SITE
      </h4>

      <table className="form-table">
        <thead>
          <tr>
            <th></th>
            <th>Description</th>
            <th>Rating/capacity</th>
            <th>Checked by</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>2.</strong>
            </td>
            <td>
              <strong>Whether the Filter Machine is Available</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.filterMachine}
                onChange={(e) => setFormData({ ...formData, filterMachine: e.target.value })}
                placeholder="(Yes/No)"
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.filterMachineChecked}
                onChange={(e) => setFormData({ ...formData, filterMachineChecked: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>3.</strong>
            </td>
            <td>
              <strong>Capacity of Filter Machine</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.filterCapacity}
                onChange={(e) => setFormData({ ...formData, filterCapacity: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.filterCapacityChecked}
                onChange={(e) => setFormData({ ...formData, filterCapacityChecked: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>4.</strong>
            </td>
            <td>
              <strong>Capacity of the Vacuum Pump to be used.</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.vacuumPumpCapacity}
                onChange={(e) => setFormData({ ...formData, vacuumPumpCapacity: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.vacuumPumpCapacityChecked}
                onChange={(e) => setFormData({ ...formData, vacuumPumpCapacityChecked: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>5.</strong>
            </td>
            <td>
              <strong>Whether the Reservoir is Available with valves and a breather.</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.reservoirAvailable}
                onChange={(e) => setFormData({ ...formData, reservoirAvailable: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.reservoirAvailableChecked}
                onChange={(e) => setFormData({ ...formData, reservoirAvailableChecked: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>6.</strong>
            </td>
            <td>
              <strong>Capacity of Reservoirs.</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.reservoirCapacity}
                onChange={(e) => setFormData({ ...formData, reservoirCapacity: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.reservoirCapacityChecked}
                onChange={(e) => setFormData({ ...formData, reservoirCapacityChecked: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>8.</strong>
            </td>
            <td>
              <strong>Hose Pipes for the Filtration Process.</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.hosePipes}
                onChange={(e) => setFormData({ ...formData, hosePipes: e.target.value })}
                placeholder="(Yes/No)"
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hosePipesChecked}
                onChange={(e) => setFormData({ ...formData, hosePipesChecked: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>9.</strong>
            </td>
            <td>
              <strong>Whether Crane is Available in good condition</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.craneAvailable}
                onChange={(e) => setFormData({ ...formData, craneAvailable: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.craneAvailableChecked}
                onChange={(e) => setFormData({ ...formData, craneAvailableChecked: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginTop: "30px", textAlign: "center" }}>SAFETY EQUIPMENT</h4>

      <table className="form-table">
        <thead>
          <tr>
            <th>Descriptions</th>
            <th>Confirmation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Fire extinguisher/ Fire sand bucket</strong>
            </td>
            <td>
              <select
                value={formData.fireExtinguisher}
                onChange={(e) => setFormData({ ...formData, fireExtinguisher: e.target.value })}
              >
                <option value="">(Yes/No)</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <strong>First aid kit</strong>
            </td>
            <td>
              <select
                value={formData.firstAidKit}
                onChange={(e) => setFormData({ ...formData, firstAidKit: e.target.value })}
              >
                <option value="">(Yes/No)</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <strong>PPE for the working team of ETC agency, like- Safety shoes, Helmet, etc...</strong>
            </td>
            <td>
              <select
                value={formData.ppeEquipment}
                onChange={(e) => setFormData({ ...formData, ppeEquipment: e.target.value })}
              >
                <option value="">(Yes/No)</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection title="Above-mentioned point" photos={photoRequirements} onPhotoChange={handlePhotoChange} />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

// Form 4: Pre-Erection Tan Delta and Capacitance Test on Bushing
function PreErectionTanDeltaTestForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    meterUsed: initialData.meterUsed || "",
    date: initialData.date || "",
    time: initialData.time || "",
    modelSrNo: initialData.modelSrNo || "",
    wti: initialData.wti || "",
    oti: initialData.oti || "",
    bushing11: initialData.bushing11 || "",
    bushing12: initialData.bushing12 || "",
    bushing11_05kv_tanDelta: initialData.bushing11_05kv_tanDelta || "",
    bushing11_05kv_capacitance: initialData.bushing11_05kv_capacitance || "",
    bushing11_05kv_excitationCurrent: initialData.bushing11_05kv_excitationCurrent || "",
    bushing11_05kv_dielectricLoss: initialData.bushing11_05kv_dielectricLoss || "",
    bushing12_05kv_tanDelta: initialData.bushing12_05kv_tanDelta || "",
    bushing12_05kv_capacitance: initialData.bushing12_05kv_capacitance || "",
    bushing12_05kv_excitationCurrent: initialData.bushing12_05kv_excitationCurrent || "",
    bushing12_05kv_dielectricLoss: initialData.bushing12_05kv_dielectricLoss || "",
    bushing11_10kv_tanDelta: initialData.bushing11_10kv_tanDelta || "",
    bushing11_10kv_capacitance: initialData.bushing11_10kv_capacitance || "",
    bushing11_10kv_excitationCurrent: initialData.bushing11_10kv_excitationCurrent || "",
    bushing11_10kv_dielectricLoss: initialData.bushing11_10kv_dielectricLoss || "",
    bushing12_10kv_tanDelta: initialData.bushing12_10kv_tanDelta || "",
    bushing12_10kv_capacitance: initialData.bushing12_10kv_capacitance || "",
    bushing12_10kv_excitationCurrent: initialData.bushing12_10kv_excitationCurrent || "",
    bushing12_10kv_dielectricLoss: initialData.bushing12_10kv_dielectricLoss || "",
    photos: initialData.photos || {},
    ...initialData,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [
    { key: "tenDeltaKit", label: "Ten delta kit" },
    { key: "calibrationReport", label: "Calibration report" },
    { key: "duringTenDeltaBushing", label: "During ten delta of bushing photo" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>Pre-Erection Tan delta and capacitance test on bushing</h2>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>METER USED:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.meterUsed}
                onChange={(e) => setFormData({ ...formData, meterUsed: e.target.value })}
              />
            </td>
            <td>
              <strong>DATE:</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </td>
            <td>
              <strong>TIME:</strong>
            </td>
            <td>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>MODEL & S. NO.</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.modelSrNo}
                onChange={(e) => setFormData({ ...formData, modelSrNo: e.target.value })}
              />
            </td>
            <td>
              <strong>WTI:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.wti}
                onChange={(e) => setFormData({ ...formData, wti: e.target.value })}
              />
            </td>
            <td>
              <strong>OTI:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.oti}
                onChange={(e) => setFormData({ ...formData, oti: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th rowSpan="2">BUSHING SR.NO.</th>
            <th>1.1</th>
            <th>1.2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td>
              <input
                type="text"
                value={formData.bushing11}
                onChange={(e) => setFormData({ ...formData, bushing11: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing12}
                onChange={(e) => setFormData({ ...formData, bushing12: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th rowSpan="2"></th>
            <th rowSpan="2">AT 05 KV PHASE</th>
            <th>TAN DELTA %</th>
            <th>CAPACITANCE (PF)</th>
            <th>EXCITATION CURRENT</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>1.1</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing11_05kv_tanDelta}
                onChange={(e) => setFormData({ ...formData, bushing11_05kv_tanDelta: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing11_05kv_capacitance}
                onChange={(e) => setFormData({ ...formData, bushing11_05kv_capacitance: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing11_05kv_excitationCurrent}
                onChange={(e) => setFormData({ ...formData, bushing11_05kv_excitationCurrent: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing11_05kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing11_05kv_dielectricLoss: e.target.value })}
              />
            </td>
             <td>
              <input
                type="text"
                value={formData.bushing11_10kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing11_10kv_dielectricLoss: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>1.2</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing12_05kv_tanDelta}
                onChange={(e) => setFormData({ ...formData, bushing12_05kv_tanDelta: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing12_05kv_capacitance}
                onChange={(e) => setFormData({ ...formData, bushing12_05kv_capacitance: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing12_05kv_excitationCurrent}
                onChange={(e) => setFormData({ ...formData, bushing12_05kv_excitationCurrent: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing12_05kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing12_05kv_dielectricLoss: e.target.value })}
              />
            </td>
             <td>
              <input
                type="text"
                value={formData.bushing11_10kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing11_10kv_dielectricLoss: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th rowSpan="2"></th>
            <th rowSpan="2">AT 10 KV PHASE</th>
            <th>TAN DELTA %</th>
            <th>CAPACITANCE (PF)</th>
            <th>EXCITATION CURRENT</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>1.1</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing11_10kv_tanDelta}
                onChange={(e) => setFormData({ ...formData, bushing11_10kv_tanDelta: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing11_10kv_capacitance}
                onChange={(e) => setFormData({ ...formData, bushing11_10kv_capacitance: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing11_10kv_excitationCurrent}
                onChange={(e) => setFormData({ ...formData, bushing11_10kv_excitationCurrent: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing11_10kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing11_10kv_dielectricLoss: e.target.value })}
              />
            </td>
             <td>
              <input
                type="text"
                value={formData.bushing11_10kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing11_10kv_dielectricLoss: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>1.2</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing12_10kv_tanDelta}
                onChange={(e) => setFormData({ ...formData, bushing12_10kv_tanDelta: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing12_10kv_capacitance}
                onChange={(e) => setFormData({ ...formData, bushing12_10kv_capacitance: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing12_10kv_excitationCurrent}
                onChange={(e) => setFormData({ ...formData, bushing12_10kv_excitationCurrent: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing12_10kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing12_10kv_dielectricLoss: e.target.value })}
              />
            </td>
             <td>
              <input
                type="text"
                value={formData.bushing11_10kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing11_10kv_dielectricLoss: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection
        title="Ten delta kit, calibration report, during ten delta of bushing photo"
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

// Form 5: Record of Measurement of IR Values
function RecordMeasurementIRValuesForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    date: initialData.date || "",
    time: initialData.time || "",
    insulationTesterDetails: initialData.insulationTesterDetails || "",
    ambTemp: initialData.ambTemp || "",
    make: initialData.make || "",
    oilTemp: initialData.oilTemp || "",
    srNo: initialData.srNo || "",
    wdgTemp: initialData.wdgTemp || "",
    range: initialData.range || "",
    relativeHumidity: initialData.relativeHumidity || "",
    voltageLevel: initialData.voltageLevel || "",
    hvEarth15Sec: initialData.hvEarth15Sec || "",
    hvEarth60Sec: initialData.hvEarth60Sec || "",
    ratioIR60IR15: initialData.ratioIR60IR15 || "",
    photos: initialData.photos || {},
    ...initialData,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [
    { key: "irTester", label: "IR tester" },
    { key: "calibrationReport", label: "Calibration report" },
    { key: "60secIRValue", label: "60 sec IR value" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>RECORD OF MEASUREMENT OF IR VALUES</h2>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>Date :</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </td>
            <td>
              <strong>Time:</strong>
            </td>
            <td>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </td>
            <td>
              <strong>Details of Insulation tester</strong>
            </td>
            {/* <td>
              <input
                type="text"
                value={formData.insulationTesterDetails}
                onChange={(e) => setFormData({ ...formData, insulationTesterDetails: e.target.value })}
              />
            </td> */}
          </tr>
          <tr>
            <td>
              <strong>Amb. Temp :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.ambTemp}
                onChange={(e) => setFormData({ ...formData, ambTemp: e.target.value })}
              />
            </td>
            <td>
              <strong>Make :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              />
            </td>
            <td rowSpan="4"></td>
            <td rowSpan="4"></td>
          </tr>
          <tr>
            <td>
              <strong>Oil Temp. :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.oilTemp}
                onChange={(e) => setFormData({ ...formData, oilTemp: e.target.value })}
              />
            </td>
            <td>
              <strong>Sr. No. :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.srNo}
                onChange={(e) => setFormData({ ...formData, srNo: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Wdg. Temp. :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.wdgTemp}
                onChange={(e) => setFormData({ ...formData, wdgTemp: e.target.value })}
              />
            </td>
            <td>
              <strong>Range :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.range}
                onChange={(e) => setFormData({ ...formData, range: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Relative Humidity :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.relativeHumidity}
                onChange={(e) => setFormData({ ...formData, relativeHumidity: e.target.value })}
              />
            </td>
            <td>
              <strong>Voltage Level :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.voltageLevel}
                onChange={(e) => setFormData({ ...formData, voltageLevel: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginTop: "30px" }}>IR Before erection -RANGE ONLY 1 KV</h4>

      <table className="form-table">
        <thead>
          <tr>
            <th></th>
            <th>15 Sec</th>
            <th>60 Sec</th>
            <th>Ratio of IR 60/IR 15</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>HV-Earth</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth15Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth15Sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth60Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth60Sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.ratioIR60IR15}
                onChange={(e) => setFormData({ ...formData, ratioIR60IR15: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection
        title="IR tester, calibration report, 60 sec IR value"
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Submit Stage 1
        </button>
      </div>
    </form>
  )
}

// Stage 2 Form Components

// Form 1: Record of Oil Handling
function RecordOilHandlingForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    tank1NoOfBarrels: initialData.tank1NoOfBarrels || "",
    tank1StartedDateTime: initialData.tank1StartedDateTime || "",
    tank1CompletedDateTime: initialData.tank1CompletedDateTime || "",
    tank1BDV: initialData.tank1BDV || "",
    tank1MoistureContent: initialData.tank1MoistureContent || "",
    filtrationRecords:
      initialData.filtrationRecords ||
      Array(10)
        .fill()
        .map(() => ({
          date: "",
          time: "",
          vacuumLevel: "",
          inletTemp: "",
          outletTemp: "",
          remark: "",
        })),
    photos: initialData.photos || {},
    ...initialData,
  })

  const handleFiltrationRecordChange = (index, field, value) => {
    const updatedRecords = [...formData.filtrationRecords]
    updatedRecords[index] = { ...updatedRecords[index], [field]: value }
    setFormData({ ...formData, filtrationRecords: updatedRecords })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [
    { key: "internalConditionReservoir", label: "Internal condition of reservoir tank" },
    { key: "calibrationReportBDV", label: "Calibration report of BDV & PPM kit" },
    { key: "oilBarrelsChecking", label: "Oil barrels checking by water pest" },
    { key: "ppmPhoto", label: "PPM Photo" },
    { key: "readingBDVValue", label: "Reading of BDV value" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>RECORD OF OIL HANDLING</h2>
        <h3>TEST VALUES PRIOR TO FILTERATION</h3>
      </div>

      <h4>Oil Filling in the Reservoirs Tank:</h4>

      <table className="form-table">
        <thead>
          <tr>
            <th></th>
            <th>No of barrels</th>
            <th>Started on Date & time</th>
            <th>Completed on Date & time</th>
            <th>BDV</th>
            <th>MOISTURE CONTENT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Tank1</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.tank1NoOfBarrels}
                onChange={(e) => setFormData({ ...formData, tank1NoOfBarrels: e.target.value })}
              />
            </td>
            <td>
              <input
                type="datetime-local"
                value={formData.tank1StartedDateTime}
                onChange={(e) => setFormData({ ...formData, tank1StartedDateTime: e.target.value })}
              />
            </td>
            <td>
              <input
                type="datetime-local"
                value={formData.tank1CompletedDateTime}
                onChange={(e) => setFormData({ ...formData, tank1CompletedDateTime: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.tank1BDV}
                onChange={(e) => setFormData({ ...formData, tank1BDV: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.tank1MoistureContent}
                onChange={(e) => setFormData({ ...formData, tank1MoistureContent: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginTop: "40px" }}>RECORD FOR OIL FILTRATION IN RESERVOIR TANK</h4>

      <table className="form-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Vacuum Level (mm/hg or torr)</th>
            <th>Inlet Temp.</th>
            <th>Outlet Temp.</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {formData.filtrationRecords.map((record, index) => (
            <tr key={index}>
              <td>
                <input
                  type="date"
                  value={record.date}
                  onChange={(e) => handleFiltrationRecordChange(index, "date", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={record.time}
                  onChange={(e) => handleFiltrationRecordChange(index, "time", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.vacuumLevel}
                  onChange={(e) => handleFiltrationRecordChange(index, "vacuumLevel", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.inletTemp}
                  onChange={(e) => handleFiltrationRecordChange(index, "inletTemp", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.outletTemp}
                  onChange={(e) => handleFiltrationRecordChange(index, "outletTemp", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.remark}
                  onChange={(e) => handleFiltrationRecordChange(index, "remark", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PhotoUploadSection
        title="Internal condition of reservoir tank, Calibration report of BDV & PPM kit, Oil barrels checking by water pest, PPM Photo, Reading of BDV value"
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

// Form 2: IR After Erection - Stage 2 End
function IRAfterErectionStage2Form({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    tempOTI: initialData.tempOTI || "",
    tempWTI: initialData.tempWTI || "",
    tempAMB: initialData.tempAMB || "",
    hvEarth15Sec: initialData.hvEarth15Sec || "",
    hvEarth60Sec: initialData.hvEarth60Sec || "",
    ratioIR60IR15: initialData.ratioIR60IR15 || "",
    hvWithRespectToEarth: initialData.hvWithRespectToEarth || "",
    lvWithRespectToEarth: initialData.lvWithRespectToEarth || "",
    neutralWithRespectToEarth: initialData.neutralWithRespectToEarth || "",
    photos: initialData.photos || {},
    ...initialData,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [
    { key: "leadClearances", label: "Lead clearances" },
    { key: "anabondBushingThimble", label: "Anabond on both bushing's thimble" },
    { key: "radiatorsFlashing", label: "Radiators flashing" },
    { key: "conservatorInternalInspection", label: "Conservator internal inspection" },
    { key: "fullTransformerPhoto", label: "Full transformer photo" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>
          IR after erection Temp OTI ........°C WTI............°C, AMB........°C &nbsp;&nbsp;&nbsp;&nbsp; RANGE ONLY 1
          KV
        </h2>
      </div>

      <div className="form-grid" style={{ marginBottom: "20px" }}>
        <div className="form-group">
          <label>OTI Temperature (°C):</label>
          <input
            type="text"
            value={formData.tempOTI}
            onChange={(e) => setFormData({ ...formData, tempOTI: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>WTI Temperature (°C):</label>
          <input
            type="text"
            value={formData.tempWTI}
            onChange={(e) => setFormData({ ...formData, tempWTI: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>AMB Temperature (°C):</label>
          <input
            type="text"
            value={formData.tempAMB}
            onChange={(e) => setFormData({ ...formData, tempAMB: e.target.value })}
          />
        </div>
      </div>

      <table className="form-table">
        <thead>
          <tr>
            <th></th>
            <th>15 Sec</th>
            <th>60 Sec</th>
            <th>Ratio of IR 60/IR 15</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>HV-Earth</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth15Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth15Sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth60Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth60Sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.ratioIR60IR15}
                onChange={(e) => setFormData({ ...formData, ratioIR60IR15: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginTop: "40px" }}>Lead Clearance in mm: -</h4>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>HV with respect to earth</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.hvWithRespectToEarth}
                onChange={(e) => setFormData({ ...formData, hvWithRespectToEarth: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>LV with respect to earth</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.lvWithRespectToEarth}
                onChange={(e) => setFormData({ ...formData, lvWithRespectToEarth: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Neutral with respect to earth</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.neutralWithRespectToEarth}
                onChange={(e) => setFormData({ ...formData, neutralWithRespectToEarth: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection
        title="Lead clearances, anabond on both bushing's thimble, radiators flashing, conservator internal inspection, full transformer photo"
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      {/* <div
        style={{
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#e53e3e",
          margin: "40px 0",
          padding: "20px",
          background: "linear-gradient(135deg, #fed7d7, #feb2b2)",
          borderRadius: "15px",
          border: "3px solid #e53e3e",
        }}
      >
        Stage two end
      </div> */}

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Submit Stage 2
        </button>
      </div>
    </form>
  )
}

// Stage 3 Form Components

// Form 1: Before Oil Filling and Pressure Test Report
function BeforeOilFillingPressureTestForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    bdvKV: initialData.bdvKV || "",
    waterContentPPM: initialData.waterContentPPM || "",
    tempOTI: initialData.tempOTI || "",
    tempWTI: initialData.tempWTI || "",
    tempAMB: initialData.tempAMB || "",
    hvEarth15Sec: initialData.hvEarth15Sec || "",
    hvEarth60Sec: initialData.hvEarth60Sec || "",
    ratioIR60IR15: initialData.ratioIR60IR15 || "",
    pressureTestDate: initialData.pressureTestDate || "",
    pressureTestRecords:
      initialData.pressureTestRecords ||
      Array(6)
        .fill()
        .map(() => ({
          srNo: "",
          timeStarted: "",
          pressureKgCm2: "",
          tempAmb: "",
          tempOTI: "",
          tempWTI: "",
        })),
    ...initialData,
  })

  const handlePressureTestRecordChange = (index, field, value) => {
    const updatedRecords = [...formData.pressureTestRecords]
    updatedRecords[index] = { ...updatedRecords[index], [field]: value }
    setFormData({ ...formData, pressureTestRecords: updatedRecords })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>Before oil filling of main tank</h2>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>
            <strong>BDV: _____ KV</strong>
          </label>
          <input
            type="text"
            value={formData.bdvKV}
            onChange={(e) => setFormData({ ...formData, bdvKV: e.target.value })}
            placeholder="Enter BDV value"
          />
        </div>
        <div className="form-group">
          <label>
            <strong>Water Content: _______ PPM</strong>
          </label>
          <input
            type="text"
            value={formData.waterContentPPM}
            onChange={(e) => setFormData({ ...formData, waterContentPPM: e.target.value })}
            placeholder="Enter water content"
          />
        </div>
      </div>

      <h4 style={{ marginTop: "40px" }}>
        IR After oil Toping up to conservator Temp OTI ........°C WTI....°C, AMB..........°C, RANGE ONLY 1 KV
      </h4>

      <div className="form-grid" style={{ marginBottom: "20px" }}>
        <div className="form-group">
          <label>OTI Temperature (°C):</label>
          <input
            type="text"
            value={formData.tempOTI}
            onChange={(e) => setFormData({ ...formData, tempOTI: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>WTI Temperature (°C):</label>
          <input
            type="text"
            value={formData.tempWTI}
            onChange={(e) => setFormData({ ...formData, tempWTI: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>AMB Temperature (°C):</label>
          <input
            type="text"
            value={formData.tempAMB}
            onChange={(e) => setFormData({ ...formData, tempAMB: e.target.value })}
          />
        </div>
      </div>

      <table className="form-table">
        <thead>
          <tr>
            <th></th>
            <th>15 Sec</th>
            <th>60 Sec</th>
            <th>Ratio of IR 60/IR 15</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>HV-Earth</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth15Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth15Sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth60Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth60Sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.ratioIR60IR15}
                onChange={(e) => setFormData({ ...formData, ratioIR60IR15: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "40px 0 20px 0" }}>
        <h4>PRESSURE TEST REPORT</h4>
        <div className="form-group" style={{ margin: 0 }}>
          <label>
            <strong>Date: -</strong>
          </label>
          <input
            type="date"
            value={formData.pressureTestDate}
            onChange={(e) => setFormData({ ...formData, pressureTestDate: e.target.value })}
          />
        </div>
      </div>

      <table className="form-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>TIME STARTED</th>
            <th>PRESSURE Kg/cm²</th>
            <th colSpan="3">TEMP°C</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th>Amb.</th>
            <th>OTI</th>
            <th>WTI</th>
          </tr>
        </thead>
        <tbody>
          {formData.pressureTestRecords.map((record, index) => (
            <tr key={index}>
              <td>
                <strong>{index + 1}</strong>
              </td>
              <td>
                <input
                  type="time"
                  value={record.timeStarted}
                  onChange={(e) => handlePressureTestRecordChange(index, "timeStarted", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.pressureKgCm2}
                  onChange={(e) => handlePressureTestRecordChange(index, "pressureKgCm2", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.tempAmb}
                  onChange={(e) => handlePressureTestRecordChange(index, "tempAmb", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.tempOTI}
                  onChange={(e) => handlePressureTestRecordChange(index, "tempOTI", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.tempWTI}
                  onChange={(e) => handlePressureTestRecordChange(index, "tempWTI", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

// Form 2: Record for Oil Filtration - Main Tank
function RecordOilFiltrationMainTankForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    filtrationRecords:
      initialData.filtrationRecords ||
      Array(15)
        .fill()
        .map(() => ({
          date: "",
          time: "",
          vacuumLevel: "",
          mcOutletTemp: "",
          otiTemp: "",
          wtiTemp: "",
          remark: "",
        })),
    tempOTI: initialData.tempOTI || "",
    tempWTI: initialData.tempWTI || "",
    tempAMB: initialData.tempAMB || "",
    hvEarth15Sec: initialData.hvEarth15Sec || "",
    hvEarth60Sec: initialData.hvEarth60Sec || "",
    ratioIR60IR15: initialData.ratioIR60IR15 || "",
    ...initialData,
  })

  const handleFiltrationRecordChange = (index, field, value) => {
    const updatedRecords = [...formData.filtrationRecords]
    updatedRecords[index] = { ...updatedRecords[index], [field]: value }
    setFormData({ ...formData, filtrationRecords: updatedRecords })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>RECORD FOR OIL FILTRATION</h2>
        <h3>Oil filtration of Main Tank</h3>
      </div>

      <table className="form-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Vacuum Level (mm/hg or torr)</th>
            <th>M/C Outlet Temp.</th>
            <th>OTI Temp.</th>
            <th>WTI Temp.</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {formData.filtrationRecords.map((record, index) => (
            <tr key={index}>
              <td>
                <input
                  type="date"
                  value={record.date}
                  onChange={(e) => handleFiltrationRecordChange(index, "date", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={record.time}
                  onChange={(e) => handleFiltrationRecordChange(index, "time", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.vacuumLevel}
                  onChange={(e) => handleFiltrationRecordChange(index, "vacuumLevel", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.mcOutletTemp}
                  onChange={(e) => handleFiltrationRecordChange(index, "mcOutletTemp", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.otiTemp}
                  onChange={(e) => handleFiltrationRecordChange(index, "otiTemp", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.wtiTemp}
                  onChange={(e) => handleFiltrationRecordChange(index, "wtiTemp", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.remark}
                  onChange={(e) => handleFiltrationRecordChange(index, "remark", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 style={{ marginTop: "40px" }}>
        IR Value before radiators/combine filtration , Temp OTI ........°C WTI............°C, AMB........°C RANGE ONLY 1
        KV
      </h4>

      <div className="form-grid" style={{ marginBottom: "20px" }}>
        <div className="form-group">
          <label>OTI Temperature (°C):</label>
          <input
            type="text"
            value={formData.tempOTI}
            onChange={(e) => setFormData({ ...formData, tempOTI: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>WTI Temperature (°C):</label>
          <input
            type="text"
            value={formData.tempWTI}
            onChange={(e) => setFormData({ ...formData, tempWTI: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>AMB Temperature (°C):</label>
          <input
            type="text"
            value={formData.tempAMB}
            onChange={(e) => setFormData({ ...formData, tempAMB: e.target.value })}
          />
        </div>
      </div>

      <table className="form-table">
        <thead>
          <tr>
            <th></th>
            <th>15 Sec</th>
            <th>60 Sec</th>
            <th>Ratio of IR 60/IR 15</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>HV-Earth</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth15Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth15Sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth60Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth60Sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.ratioIR60IR15}
                onChange={(e) => setFormData({ ...formData, ratioIR60IR15: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

// Form 3: Oil Filtration of Radiator and Combine
function OilFiltrationRadiatorCombineForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    // Oil filtration of Radiator records
    radiatorRecords:
      initialData.radiatorRecords ||
      Array(5)
        .fill()
        .map(() => ({
          date: "",
          time: "",
          vacuumLevel: "",
          mcOutletTemp: "",
          otiTemp: "",
          wtiTemp: "",
          remark: "",
        })),
    // Oil filtration of Combine records
    combineRecords:
      initialData.combineRecords ||
      Array(5)
        .fill()
        .map(() => ({
          date: "",
          time: "",
          vacuumLevel: "",
          mcOutletTemp: "",
          otiTemp: "",
          wtiTemp: "",
          remark: "",
        })),
    // After Oil Filtration of main tank
    bdvKV: initialData.bdvKV || "",
    waterContentPPM: initialData.waterContentPPM || "",
    // PI Value after filteration
    tempOTI: initialData.tempOTI || "",
    tempWTI: initialData.tempWTI || "",
    tempAMB: initialData.tempAMB || "",
    hvEarth15Sec: initialData.hvEarth15Sec || "",
    hvEarth60Sec: initialData.hvEarth60Sec || "",
    hvEarth600Sec: initialData.hvEarth600Sec || "",
    hvEarth60600Sec: initialData.hvEarth60600Sec || "",
    photos: initialData.photos || {},
    ...initialData,
  })

  const handleRadiatorRecordChange = (index, field, value) => {
    const updatedRecords = [...formData.radiatorRecords]
    updatedRecords[index] = { ...updatedRecords[index], [field]: value }
    setFormData({ ...formData, radiatorRecords: updatedRecords })
  }

  const handleCombineRecordChange = (index, field, value) => {
    const updatedRecords = [...formData.combineRecords]
    updatedRecords[index] = { ...updatedRecords[index], [field]: value }
    setFormData({ ...formData, combineRecords: updatedRecords })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const photoRequirements = [
    { key: "ppmPhoto", label: "PPM Photo" },
    { key: "readingBDVValue", label: "Reading of BDV value" },
    { key: "airCell", label: "Air cell" },
    { key: "mog", label: "Mog" },
    { key: "pog", label: "Pog" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>Oil filtration of Radiator</h2>
      </div>

      <table className="form-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Vacuum Level (mm/hg or torr)</th>
            <th>M/C Outlet Temp.</th>
            <th>OTI Temp.</th>
            <th>WTI Temp.</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {formData.radiatorRecords.map((record, index) => (
            <tr key={index}>
              <td>
                <input
                  type="date"
                  value={record.date}
                  onChange={(e) => handleRadiatorRecordChange(index, "date", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={record.time}
                  onChange={(e) => handleRadiatorRecordChange(index, "time", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.vacuumLevel}
                  onChange={(e) => handleRadiatorRecordChange(index, "vacuumLevel", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.mcOutletTemp}
                  onChange={(e) => handleRadiatorRecordChange(index, "mcOutletTemp", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.otiTemp}
                  onChange={(e) => handleRadiatorRecordChange(index, "otiTemp", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.wtiTemp}
                  onChange={(e) => handleRadiatorRecordChange(index, "wtiTemp", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.remark}
                  onChange={(e) => handleRadiatorRecordChange(index, "remark", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 style={{ marginTop: "40px" }}>Oil filtration of Combine (Main Tank + Cooler bank)</h4>

      <table className="form-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Vacuum Level (mm/hg or torr)</th>
            <th>M/C Outlet Temp.</th>
            <th>OTI Temp.</th>
            <th>WTI Temp.</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {formData.combineRecords.map((record, index) => (
            <tr key={index}>
              <td>
                <input
                  type="date"
                  value={record.date}
                  onChange={(e) => handleCombineRecordChange(index, "date", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={record.time}
                  onChange={(e) => handleCombineRecordChange(index, "time", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.vacuumLevel}
                  onChange={(e) => handleCombineRecordChange(index, "vacuumLevel", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.mcOutletTemp}
                  onChange={(e) => handleCombineRecordChange(index, "mcOutletTemp", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.otiTemp}
                  onChange={(e) => handleCombineRecordChange(index, "otiTemp", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.wtiTemp}
                  onChange={(e) => handleCombineRecordChange(index, "wtiTemp", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={record.remark}
                  onChange={(e) => handleCombineRecordChange(index, "remark", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 style={{ marginTop: "40px" }}>After Oil Filtration of main tank</h4>

      <div className="form-grid">
        <div className="form-group">
          <label>
            <strong>BDV: _____ KV</strong>
          </label>
          <input
            type="text"
            value={formData.bdvKV}
            onChange={(e) => setFormData({ ...formData, bdvKV: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>
            <strong>Water Content: _______ PPM</strong>
          </label>
          <input
            type="text"
            value={formData.waterContentPPM}
            onChange={(e) => setFormData({ ...formData, waterContentPPM: e.target.value })}
          />
        </div>
      </div>

      <h4 style={{ marginTop: "40px" }}>
        PI Value after filteration, Temp OTI ........°C WTI............°C, AMB........°C RANGE ONLY 5 KV
      </h4>

      <div className="form-grid" style={{ marginBottom: "20px" }}>
        <div className="form-group">
          <label>OTI Temperature (°C):</label>
          <input
            type="text"
            value={formData.tempOTI}
            onChange={(e) => setFormData({ ...formData, tempOTI: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>WTI Temperature (°C):</label>
          <input
            type="text"
            value={formData.tempWTI}
            onChange={(e) => setFormData({ ...formData, tempWTI: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>AMB Temperature (°C):</label>
          <input
            type="text"
            value={formData.tempAMB}
            onChange={(e) => setFormData({ ...formData, tempAMB: e.target.value })}
          />
        </div>
      </div>

      <table className="form-table">
        <thead>
          <tr>
            <th></th>
            <th>15 Sec</th>
            <th>60 Sec</th>
            <th>600 sec</th>
            <th>60/600 sec</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>HV-Earth</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth15Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth15Sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth60Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth60Sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth600Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth600Sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth60600Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth60600Sec: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection
        title="PPM Photo, Reading of BDV value, Air cell, Mog, Pog"
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Submit Stage 3
        </button>
      </div>
    </form>
  )
}

// Stage 4 Form Components - Based on provided images

// Form 1: SFRA Test Record
function SFRATestRecordForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    makeOfMeter: initialData.makeOfMeter || "",
    date: initialData.date || "",
    modelSrNo: initialData.modelSrNo || "",
    ambient: initialData.ambient || "",
    oti: initialData.oti || "",
    wti: initialData.wti || "",
    testReportReviewed: initialData.testReportReviewed || "",
    acceptanceOfTest: initialData.acceptanceOfTest || "",
    // Tan delta and capacitance test on bushing
    meterUsedBushing: initialData.meterUsedBushing || "",
    dateBushing: initialData.dateBushing || "",
    timeBushing: initialData.timeBushing || "",
    modelSrNoBushing: initialData.modelSrNoBushing || "",
    wtiBushing: initialData.wtiBushing || "",
    otiBushing: initialData.otiBushing || "",
    // AT 05 KV PHASE
    bushing11_05kv_tanDelta: initialData.bushing11_05kv_tanDelta || "",
    bushing11_05kv_capacitance: initialData.bushing11_05kv_capacitance || "",
    bushing11_05kv_excitationCurrent: initialData.bushing11_05kv_excitationCurrent || "",
    bushing11_05kv_dielectricLoss: initialData.bushing11_05kv_dielectricLoss || "",
    bushing12_05kv_tanDelta: initialData.bushing12_05kv_tanDelta || "",
    bushing12_05kv_capacitance: initialData.bushing12_05kv_capacitance || "",
    bushing12_05kv_excitationCurrent: initialData.bushing12_05kv_excitationCurrent || "",
    bushing12_05kv_dielectricLoss: initialData.bushing12_05kv_dielectricLoss || "",
    // AT 10 KV PHASE
    bushing11_10kv_tanDelta: initialData.bushing11_10kv_tanDelta || "",
    bushing11_10kv_capacitance: initialData.bushing11_10kv_capacitance || "",
    bushing11_10kv_excitationCurrent: initialData.bushing11_10kv_excitationCurrent || "",
    bushing11_10kv_dielectricLoss: initialData.bushing11_10kv_dielectricLoss || "",
    bushing12_10kv_tanDelta: initialData.bushing12_10kv_tanDelta || "",
    bushing12_10kv_capacitance: initialData.bushing12_10kv_capacitance || "",
    bushing12_10kv_excitationCurrent: initialData.bushing12_10kv_excitationCurrent || "",
    bushing12_10kv_dielectricLoss: initialData.bushing12_10kv_dielectricLoss || "",
    // Tan delta and capacitance test on winding
    meterUsedWinding: initialData.meterUsedWinding || "",
    dateWinding: initialData.dateWinding || "",
    timeWinding: initialData.timeWinding || "",
    makeSrNoWinding: initialData.makeSrNoWinding || "",
    ambientTempWinding: initialData.ambientTempWinding || "",
    oilTempWinding: initialData.oilTempWinding || "",
    // AT 05 KV IN BETWEEN HV-G
    hvg_05kv_tanDelta: initialData.hvg_05kv_tanDelta || "",
    hvg_05kv_capacitance: initialData.hvg_05kv_capacitance || "",
    hvg_05kv_excitationCurrent: initialData.hvg_05kv_excitationCurrent || "",
    hvg_05kv_dielectricLoss: initialData.hvg_05kv_dielectricLoss || "",
    // AT 10 KV IN BETWEEN HV-G
    hvg_10kv_tanDelta: initialData.hvg_10kv_tanDelta || "",
    hvg_10kv_capacitance: initialData.hvg_10kv_capacitance || "",
    hvg_10kv_excitationCurrent: initialData.hvg_10kv_excitationCurrent || "",
    hvg_10kv_dielectricLoss: initialData.hvg_10kv_dielectricLoss || "",
    ...initialData,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>SFRA TEST RECORD</h2>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>MAKE OF METER</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.makeOfMeter}
                onChange={(e) => setFormData({ ...formData, makeOfMeter: e.target.value })}
              />
            </td>
            <td>
              <strong>DATE</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>MODEL & S. NO.</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.modelSrNo}
                onChange={(e) => setFormData({ ...formData, modelSrNo: e.target.value })}
              />
            </td>
            <td>
              <strong>AMBIENT:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.ambient}
                onChange={(e) => setFormData({ ...formData, ambient: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>OTI</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.oti}
                onChange={(e) => setFormData({ ...formData, oti: e.target.value })}
                placeholder="°C"
              />
            </td>
            <td>
              <strong>WTI</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.wti}
                onChange={(e) => setFormData({ ...formData, wti: e.target.value })}
                placeholder="°C"
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Test report reviewed by</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.testReportReviewed}
                onChange={(e) => setFormData({ ...formData, testReportReviewed: e.target.value })}
              />
            </td>
            <td>
              <strong>Acceptance of the test</strong>
            </td>
            <td>
              <select
                value={formData.acceptanceOfTest}
                onChange={(e) => setFormData({ ...formData, acceptanceOfTest: e.target.value })}
              >
                <option value="">Yes / No</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginTop: "40px", textAlign: "center" }}>Tan delta and capacitance test on bushing</h4>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>METER USED</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.meterUsedBushing}
                onChange={(e) => setFormData({ ...formData, meterUsedBushing: e.target.value })}
              />
            </td>
            <td>
              <strong>DATE:</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.dateBushing}
                onChange={(e) => setFormData({ ...formData, dateBushing: e.target.value })}
              />
            </td>
            <td>
              <strong>TIME :</strong>
            </td>
            <td>
              <input
                type="time"
                value={formData.timeBushing}
                onChange={(e) => setFormData({ ...formData, timeBushing: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>MODEL & S. NO.</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.modelSrNoBushing}
                onChange={(e) => setFormData({ ...formData, modelSrNoBushing: e.target.value })}
              />
            </td>
            <td>
              <strong>WTI:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.wtiBushing}
                onChange={(e) => setFormData({ ...formData, wtiBushing: e.target.value })}
              />
            </td>
            <td>
              <strong>OTI:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.otiBushing}
                onChange={(e) => setFormData({ ...formData, otiBushing: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th rowSpan="2"></th>
            <th rowSpan="2">AT 05 KV PHASE</th>
            <th>TAN DELTA %</th>
            <th>CAPACITANCE (PF)</th>
            <th>EXCITATION CURRENT</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>1.1</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing11_05kv_tanDelta}
                onChange={(e) => setFormData({ ...formData, bushing11_05kv_tanDelta: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing11_05kv_capacitance}
                onChange={(e) => setFormData({ ...formData, bushing11_05kv_capacitance: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing11_05kv_excitationCurrent}
                onChange={(e) => setFormData({ ...formData, bushing11_05kv_excitationCurrent: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing11_05kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing11_05kv_dielectricLoss: e.target.value })}
              />
            </td>
             <td>
              <input
                type="text"
                value={formData.bushing11_10kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing11_10kv_dielectricLoss: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>1.2</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing12_05kv_tanDelta}
                onChange={(e) => setFormData({ ...formData, bushing12_05kv_tanDelta: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing12_05kv_capacitance}
                onChange={(e) => setFormData({ ...formData, bushing12_05kv_capacitance: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing12_05kv_excitationCurrent}
                onChange={(e) => setFormData({ ...formData, bushing12_05kv_excitationCurrent: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing12_05kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing12_05kv_dielectricLoss: e.target.value })}
              />
            </td>
             <td>
              <input
                type="text"
                value={formData.bushing11_10kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing11_10kv_dielectricLoss: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th rowSpan="2"></th>
            <th rowSpan="2">AT 10 KV PHASE</th>
            <th>TAN DELTA %</th>
            <th>CAPACITANCE (PF)</th>
            <th>EXCITATION CURRENT</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>1.1</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing11_10kv_tanDelta}
                onChange={(e) => setFormData({ ...formData, bushing11_10kv_tanDelta: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing11_10kv_capacitance}
                onChange={(e) => setFormData({ ...formData, bushing11_10kv_capacitance: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing11_10kv_excitationCurrent}
                onChange={(e) => setFormData({ ...formData, bushing11_10kv_excitationCurrent: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing11_10kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing11_10kv_dielectricLoss: e.target.value })}
              />
            </td>
             <td>
              <input
                type="text"
                value={formData.bushing11_10kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing11_10kv_dielectricLoss: e.target.value })}
              />
            </td>
             <td>
              <input
                type="text"
                value={formData.bushing11_10kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing11_10kv_dielectricLoss: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>1.2</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing12_10kv_tanDelta}
                onChange={(e) => setFormData({ ...formData, bushing12_10kv_tanDelta: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing12_10kv_capacitance}
                onChange={(e) => setFormData({ ...formData, bushing12_10kv_capacitance: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing12_10kv_excitationCurrent}
                onChange={(e) => setFormData({ ...formData, bushing12_10kv_excitationCurrent: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushing12_10kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing12_10kv_dielectricLoss: e.target.value })}
              />
            </td>
             <td>
              <input
                type="text"
                value={formData.bushing11_10kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing11_10kv_dielectricLoss: e.target.value })}
              />
            </td>
             <td>
              <input
                type="text"
                value={formData.bushing11_10kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing11_10kv_dielectricLoss: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginTop: "40px", textAlign: "center" }}>Tan delta and capacitance test on winding</h4>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>METER USED</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.meterUsedWinding}
                onChange={(e) => setFormData({ ...formData, meterUsedWinding: e.target.value })}
              />
            </td>
            <td>
              <strong>DATE:</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.dateWinding}
                onChange={(e) => setFormData({ ...formData, dateWinding: e.target.value })}
              />
            </td>
            <td>
              <strong>TIME :</strong>
            </td>
            <td>
              <input
                type="time"
                value={formData.timeWinding}
                onChange={(e) => setFormData({ ...formData, timeWinding: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>MAKE & S. NO.</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.makeSrNoWinding}
                onChange={(e) => setFormData({ ...formData, makeSrNoWinding: e.target.value })}
              />
            </td>
            <td>
              <strong>AMBIENT TEMP</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.ambientTempWinding}
                onChange={(e) => setFormData({ ...formData, ambientTempWinding: e.target.value })}
              />
            </td>
            <td>
              <strong>OIL TEMP</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.oilTempWinding}
                onChange={(e) => setFormData({ ...formData, oilTempWinding: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th></th>
            <th>AT 05 KV IN BETWEEN</th>
            <th>TAN DELTA</th>
            <th>CAPACITANCE</th>
            <th>EXCITATION CURRENT</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>HV – G</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.hvg_05kv_tanDelta}
                onChange={(e) => setFormData({ ...formData, hvg_05kv_tanDelta: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvg_05kv_capacitance}
                onChange={(e) => setFormData({ ...formData, hvg_05kv_capacitance: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvg_05kv_excitationCurrent}
                onChange={(e) => setFormData({ ...formData, hvg_05kv_excitationCurrent: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvg_05kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, hvg_05kv_dielectricLoss: e.target.value })}
              />
            </td>
             <td>
              <input
                type="text"
                value={formData.bushing11_10kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing11_10kv_dielectricLoss: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th></th>
            <th>AT 10 KV IN BETWEEN</th>
            <th>TAN DELTA</th>
            <th>CAPACITANCE</th>
            <th>EXCITATION CURRENT</th>
            <th>DIELECTRIC LOSS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>HV – G</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.hvg_10kv_tanDelta}
                onChange={(e) => setFormData({ ...formData, hvg_10kv_tanDelta: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvg_10kv_capacitance}
                onChange={(e) => setFormData({ ...formData, hvg_10kv_capacitance: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvg_10kv_excitationCurrent}
                onChange={(e) => setFormData({ ...formData, hvg_10kv_excitationCurrent: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvg_10kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, hvg_10kv_dielectricLoss: e.target.value })}
              />
            </td>
             <td>
              <input
                type="text"
                value={formData.bushing11_10kv_dielectricLoss}
                onChange={(e) => setFormData({ ...formData, bushing11_10kv_dielectricLoss: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

// Form 2: Record of Measurement of IR Values & Voltage Ratio Test
function IRVoltageRatioMagnetisingTestForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    // IR Values section
    date: initialData.date || "",
    time: initialData.time || "",
    insulationTesterDetails: initialData.insulationTesterDetails || "",
    ambTemp: initialData.ambTemp || "",
    make: initialData.make || "",
    oilTemp: initialData.oilTemp || "",
    srNo: initialData.srNo || "",
    wdgTemp: initialData.wdgTemp || "",
    range: initialData.range || "",
    relativeHumidity: initialData.relativeHumidity || "",
    voltageLevel: initialData.voltageLevel || "",
    hvEarth10Sec: initialData.hvEarth10Sec || "",
    hvEarth60Sec: initialData.hvEarth60Sec || "",
    ratioIR60IR10: initialData.ratioIR60IR10 || "",
    // Voltage Ratio Test
    voltageRatioTests: initialData.voltageRatioTests || [
      { appliedVoltage: "1.1 – 1.2", measuredVoltage11_21: "", measuredVoltage12_21: "" },
      { appliedVoltage: "1.1 – 2.1", measuredVoltage11_12: "", measuredVoltage12_21: "" },
      { appliedVoltage: "2.1 – 1.2", measuredVoltage11_12: "", measuredVoltage11_21: "" },
    ],
    // Magnetising Current Test
    appliedVoltageMag: initialData.appliedVoltageMag || "",
    dateMag: initialData.dateMag || "",
    timeMag: initialData.timeMag || "",
    meterMakeSrNoMag: initialData.meterMakeSrNoMag || "",
    magnetisingTests: initialData.magnetisingTests || [
      { appliedVoltage: "1.1 –1.2", measuredCurrent: "1.1 – 1.2" },
      { appliedVoltage: "1.1 – 2.1", measuredCurrent: "1.1 – 2.1" },
      { appliedVoltage: "2.1 – 1.2", measuredCurrent: "2.1 – 1.2" },
    ],
    ...initialData,
  })

  const handleVoltageRatioTestChange = (index, field, value) => {
    const updatedTests = [...formData.voltageRatioTests]
    updatedTests[index] = { ...updatedTests[index], [field]: value }
    setFormData({ ...formData, voltageRatioTests: updatedTests })
  }

  const handleMagnetisingTestChange = (index, field, value) => {
    const updatedTests = [...formData.magnetisingTests]
    updatedTests[index] = { ...updatedTests[index], [field]: value }
    setFormData({ ...formData, magnetisingTests: updatedTests })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>RECORD OF MEASUREMENT OF IR VALUES</h2>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>Date :</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </td>
            <td>
              <strong>Time:</strong>
            </td>
            <td>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </td>
            <td>
              <strong>Details of Insulation tester</strong>
            </td>
            {/* <td>
              <input
                type="text"
                value={formData.insulationTesterDetails}
                onChange={(e) => setFormData({ ...formData, insulationTesterDetails: e.target.value })}
              />
            </td> */}
          </tr>
          <tr>
            <td>
              <strong>Amb. Temp :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.ambTemp}
                onChange={(e) => setFormData({ ...formData, ambTemp: e.target.value })}
              />
            </td>
            <td>
              <strong>Make :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              />
            </td>
            <td rowSpan="4"></td>
            <td rowSpan="4"></td>
          </tr>
          <tr>
            <td>
              <strong>Oil Temp. :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.oilTemp}
                onChange={(e) => setFormData({ ...formData, oilTemp: e.target.value })}
              />
            </td>
            <td>
              <strong>Sr. No. :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.srNo}
                onChange={(e) => setFormData({ ...formData, srNo: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Wdg. Temp. :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.wdgTemp}
                onChange={(e) => setFormData({ ...formData, wdgTemp: e.target.value })}
              />
            </td>
            <td>
              <strong>Range :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.range}
                onChange={(e) => setFormData({ ...formData, range: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Relative Humidity :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.relativeHumidity}
                onChange={(e) => setFormData({ ...formData, relativeHumidity: e.target.value })}
              />
            </td>
            <td>
              <strong>Voltage Level :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.voltageLevel}
                onChange={(e) => setFormData({ ...formData, voltageLevel: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th></th>
            <th>10 Sec</th>
            <th>60 Sec</th>
            <th>Ratio of IR 60/10</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>HV-Earth</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth10Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth10Sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth60Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth60Sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.ratioIR60IR10}
                onChange={(e) => setFormData({ ...formData, ratioIR60IR10: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginTop: "40px", textAlign: "center" }}>TYPE OF TEST – VOLTAGE RATIO TEST</h4>

      <table className="form-table">
        <thead>
          <tr>
            <th>Applied Voltage</th>
            <th colSpan="2">Measured Voltage</th>
          </tr>
          <tr>
            <th></th>
            <th>1.1 – 2.1</th>
            <th>1.2 – 2.1</th>
          </tr>
        </thead>
        <tbody>
          {formData.voltageRatioTests.map((test, index) => (
            <tr key={index}>
              <td>
                <strong>{test.appliedVoltage}</strong>
              </td>
              <td>
                <input
                  type="text"
                  value={test.measuredVoltage11_21}
                  onChange={(e) => handleVoltageRatioTestChange(index, "measuredVoltage11_21", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={test.measuredVoltage12_21}
                  onChange={(e) => handleVoltageRatioTestChange(index, "measuredVoltage12_21", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 style={{ marginTop: "40px", textAlign: "center" }}>TYPE OF TEST – MAGNETISING CURRENT TEST</h4>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>APPLIED VOLTAGE:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.appliedVoltageMag}
                onChange={(e) => setFormData({ ...formData, appliedVoltageMag: e.target.value })}
                placeholder="VOLTS"
              />
            </td>
            <td>
              <strong>DATE:</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.dateMag}
                onChange={(e) => setFormData({ ...formData, dateMag: e.target.value })}
              />
            </td>
            <td>
              <strong>TIME:</strong>
            </td>
            <td>
              <input
                type="time"
                value={formData.timeMag}
                onChange={(e) => setFormData({ ...formData, timeMag: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>METER MAKE SR. NO.</strong>
            </td>
            <td colSpan="5">
              <input
                type="text"
                value={formData.meterMakeSrNoMag}
                onChange={(e) => setFormData({ ...formData, meterMakeSrNoMag: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Applied Voltage</th>
            <th>Measured Current</th>
          </tr>
        </thead>
        <tbody>
          {formData.magnetisingTests.map((test, index) => (
            <tr key={index}>
              <td>
                <strong>{test.appliedVoltage}</strong>
              </td>
              <td>
                <input
                  type="text"
                  value={test.measuredCurrent}
                  onChange={(e) => handleMagnetisingTestChange(index, "measuredCurrent", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

// Form 3: Short Circuit Test
function ShortCircuitTestForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    appliedVoltage: initialData.appliedVoltage || "",
    date: initialData.date || "",
    time: initialData.time || "",
    meterMakeSrNo: initialData.meterMakeSrNo || "",
    // Short circuit test measurements
    test11_12_measuredCurrent11: initialData.test11_12_measuredCurrent11 || "",
    test11_12_measuredCurrent12_21: initialData.test11_12_measuredCurrent12_21 || "",
    test12_21_measuredCurrent12: initialData.test12_21_measuredCurrent12 || "",
    test12_21_measuredCurrent11_21: initialData.test12_21_measuredCurrent11_21 || "",
    // Impedance calculation
    appliedVoltageHV: initialData.appliedVoltageHV || "",
    ratedCurrentLV: initialData.ratedCurrentLV || "",
    percentZ: initialData.percentZ || "",
    ratedVoltageHV: initialData.ratedVoltageHV || "",
    measuredCurrentLV: initialData.measuredCurrentLV || "",
    ...initialData,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>TYPE OF TEST – SHORT CIRCUIT TEST</h2>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>APPLIED VOLTAGE:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.appliedVoltage}
                onChange={(e) => setFormData({ ...formData, appliedVoltage: e.target.value })}
                placeholder="VOLTS"
              />
            </td>
            <td>
              <strong>DATE:</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </td>
            <td>
              <strong>TIME :</strong>
            </td>
            <td>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>METER MAKE SR. NO.</strong>
            </td>
            <td colSpan="5">
              <input
                type="text"
                value={formData.meterMakeSrNo}
                onChange={(e) => setFormData({ ...formData, meterMakeSrNo: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>APPLIED VOLTAGE</th>
            <th colSpan="2">Measured Current</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>1.1 – 1.2</strong>
            </td>
            <td>
              <strong>1.1</strong>
            </td>
            <td>
              <strong>1.2 – 2.1 SHORTED</strong>
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <input
                type="text"
                value={formData.test11_12_measuredCurrent11}
                onChange={(e) => setFormData({ ...formData, test11_12_measuredCurrent11: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.test11_12_measuredCurrent12_21}
                onChange={(e) => setFormData({ ...formData, test11_12_measuredCurrent12_21: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>1.2 – 2.1</strong>
            </td>
            <td>
              <strong>1.2</strong>
            </td>
            <td>
              <strong>1.1 – 2.1 SHORTED</strong>
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <input
                type="text"
                value={formData.test12_21_measuredCurrent12}
                onChange={(e) => setFormData({ ...formData, test12_21_measuredCurrent12: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.test12_21_measuredCurrent11_21}
                onChange={(e) => setFormData({ ...formData, test12_21_measuredCurrent11_21: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <tbody>
          <tr>
            <td rowSpan="4">
              <strong>Impedance calculation</strong>
            </td>
            <td>
              <strong>Applied Voltage HV</strong>
            </td>
            <td>
              <strong>Rated Current LV</strong>
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="text"
                value={formData.appliedVoltageHV}
                onChange={(e) => setFormData({ ...formData, appliedVoltageHV: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.ratedCurrentLV}
                onChange={(e) => setFormData({ ...formData, ratedCurrentLV: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>%Z = _____________ X _____________ X 100</strong>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="text"
                  value={formData.percentZ}
                  onChange={(e) => setFormData({ ...formData, percentZ: e.target.value })}
                  placeholder="%Z ="
                  style={{ width: "80px" }}
                />
                <span>
                  <strong>Rated voltage HV</strong>
                </span>
                <input
                  type="text"
                  value={formData.ratedVoltageHV}
                  onChange={(e) => setFormData({ ...formData, ratedVoltageHV: e.target.value })}
                  style={{ width: "120px" }}
                />
                <span>
                  <strong>Measured current LV</strong>
                </span>
                <input
                  type="text"
                  value={formData.measuredCurrentLV}
                  onChange={(e) => setFormData({ ...formData, measuredCurrentLV: e.target.value })}
                  style={{ width: "120px" }}
                />
              </div>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

// Form 4: Winding Resistance Test and Record of Measurement of IR & PI Values
function WindingResistanceIRPITestForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    // Winding Resistance Test
    meterUsed: initialData.meterUsed || "",
    date: initialData.date || "",
    time: initialData.time || "",
    meterMakeSrNo: initialData.meterMakeSrNo || "",
    wti: initialData.wti || "",
    oti: initialData.oti || "",
    range: initialData.range || "",
    ambient: initialData.ambient || "",
    // Winding resistance measurements
    winding11_12: initialData.winding11_12 || "",
    winding11_21: initialData.winding11_21 || "",
    winding21_12: initialData.winding21_12 || "",
    // IR & PI Values
    dateIR: initialData.dateIR || "",
    timeIR: initialData.timeIR || "",
    insulationTesterDetails: initialData.insulationTesterDetails || "",
    ambTempIR: initialData.ambTempIR || "",
    makeIR: initialData.makeIR || "",
    oilTempIR: initialData.oilTempIR || "",
    srNoIR: initialData.srNoIR || "",
    wdgTempIR: initialData.wdgTempIR || "",
    rangeIR: initialData.rangeIR || "",
    relativeHumidityIR: initialData.relativeHumidityIR || "",
    voltageLevelIR: initialData.voltageLevelIR || "",
    // IR measurements
    hvEarth10Sec: initialData.hvEarth10Sec || "",
    hvEarth60Sec: initialData.hvEarth60Sec || "",
    hvEarth600Sec: initialData.hvEarth600Sec || "",
    ratioIR60IR10: initialData.ratioIR60IR10 || "",
    ratioIR600IR60: initialData.ratioIR600IR60 || "",
    signatures: initialData.signatures || {
      vpesName: "",
      vpesSignature: "",
      customerName: "",
      customerSignature: "",
    },
    photos: initialData.photos || {},
    ...initialData,
  })

  const handleSignatureChange = (key, type, value) => {
    setFormData((prev) => ({
      ...prev,
      signatures: {
        ...prev.signatures,
        [`${key}${type === "name" ? "Name" : "Signature"}`]: value,
      },
    }))
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const photoRequirements = [
    { key: "sfraKit", label: "SFRA kit calibration" },
    { key: "tenDeltaKit", label: "Ten delta kit calibration" },
    { key: "multimeter", label: "Multimeter" },
    { key: "megger", label: "Megger" },
    { key: "windingResistanceKit", label: "Winding resistance kit" },
    { key: "clampMeter", label: "Clamp meter" },
  ]

  const signatureRequirements = [
    { key: "vpes", label: "Checked by VPES:" },
    { key: "customer", label: "Witnessed By Customer:" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>TYPE OF TEST – WINDING RESISTANCE TEST</h2>
      </div>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>METER USED</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.meterUsed}
                onChange={(e) => setFormData({ ...formData, meterUsed: e.target.value })}
              />
            </td>
            <td>
              <strong>DATE:</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </td>
            <td>
              <strong>TIME :</strong>
            </td>
            <td>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>METER MAKE SR. NO.</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.meterMakeSrNo}
                onChange={(e) => setFormData({ ...formData, meterMakeSrNo: e.target.value })}
              />
            </td>
            <td>
              <strong>WTI:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.wti}
                onChange={(e) => setFormData({ ...formData, wti: e.target.value })}
              />
            </td>
            <td>
              <strong>OTI:</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.oti}
                onChange={(e) => setFormData({ ...formData, oti: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>RANGE</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.range}
                onChange={(e) => setFormData({ ...formData, range: e.target.value })}
              />
            </td>
            <td>
              <strong>AMBIENT:</strong>
            </td>
            <td colSpan="3">
              <input
                type="text"
                value={formData.ambient}
                onChange={(e) => setFormData({ ...formData, ambient: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginTop: "30px", textAlign: "center" }}>ALL MEASUREMENT IN OHMS / MILI OHMS</h4>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>1.1 – 1.2</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.winding11_12}
                onChange={(e) => setFormData({ ...formData, winding11_12: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.winding11_12}
                onChange={(e) => setFormData({ ...formData, winding11_12: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>1.1 = 2.1</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.winding11_21}
                onChange={(e) => setFormData({ ...formData, winding11_21: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.winding11_21}
                onChange={(e) => setFormData({ ...formData, winding11_21: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>2.1 – 1.2</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.winding21_12}
                onChange={(e) => setFormData({ ...formData, winding21_12: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.winding21_12}
                onChange={(e) => setFormData({ ...formData, winding21_12: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <h4 style={{ marginTop: "40px", textAlign: "center" }}>RECORD OF MEASUREMENT OF IR & PI VALUES</h4>

      <table className="form-table">
        <tbody>
          <tr>
            <td>
              <strong>Date :</strong>
            </td>
            <td>
              <input
                type="date"
                value={formData.dateIR}
                onChange={(e) => setFormData({ ...formData, dateIR: e.target.value })}
              />
            </td>
            <td>
              <strong>Time:</strong>
            </td>
            <td>
              <input
                type="time"
                value={formData.timeIR}
                onChange={(e) => setFormData({ ...formData, timeIR: e.target.value })}
              />
            </td>
            <td>
              <strong>Details of Insulation tester</strong>
            </td>
            {/* <td>
              <input
                type="text"
                value={formData.insulationTesterDetails}
                onChange={(e) => setFormData({ ...formData, insulationTesterDetails: e.target.value })}
              />
            </td> */}
          </tr>
          <tr>
            <td>
              <strong>Amb. Temp :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.ambTempIR}
                onChange={(e) => setFormData({ ...formData, ambTempIR: e.target.value })}
              />
            </td>
            <td>
              <strong>Make :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.makeIR}
                onChange={(e) => setFormData({ ...formData, makeIR: e.target.value })}
              />
            </td>
            <td rowSpan="4"></td>
            <td rowSpan="4"></td>
          </tr>
          <tr>
            <td>
              <strong>Oil Temp. :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.oilTempIR}
                onChange={(e) => setFormData({ ...formData, oilTempIR: e.target.value })}
              />
            </td>
            <td>
              <strong>Sr. No. :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.srNoIR}
                onChange={(e) => setFormData({ ...formData, srNoIR: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Wdg. Temp. :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.wdgTempIR}
                onChange={(e) => setFormData({ ...formData, wdgTempIR: e.target.value })}
              />
            </td>
            <td>
              <strong>Range :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.rangeIR}
                onChange={(e) => setFormData({ ...formData, rangeIR: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong>Relative Humidity :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.relativeHumidityIR}
                onChange={(e) => setFormData({ ...formData, relativeHumidityIR: e.target.value })}
              />
            </td>
            <td>
              <strong>Voltage Level :</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.voltageLevelIR}
                onChange={(e) => setFormData({ ...formData, voltageLevelIR: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th></th>
            <th>10 Sec</th>
            <th>60 Sec</th>
            <th>600 Sec</th>
            <th>Ratio of IR 60 IR 10</th>
            <th>Ratio of IR 600/ 60</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>HV-Earth</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth10Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth10Sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth60Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth60Sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth600Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth600Sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.ratioIR60IR10}
                onChange={(e) => setFormData({ ...formData, ratioIR60IR10: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.ratioIR600IR60}
                onChange={(e) => setFormData({ ...formData, ratioIR600IR60: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <PhotoUploadSection
        title="SFRA kit calibration, ten delta kit calibration, multimeter, megger, winding resistance kit, clamp meter"
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <DigitalSignatureSection
        signatures={signatureRequirements.map((sig) => ({
          ...sig,
          nameValue: formData.signatures[`${sig.key}Name`] || "",
          signature: formData.signatures[`${sig.key}Signature`] || "",
        }))}
        onSignatureChange={handleSignatureChange}
      />

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Submit Stage 4
        </button>
      </div>
    </form>
  )
}

// Stage 5 Form Components - Based on provided images

// Form 1: Pre-Charging Check List
function PreChargingChecklistForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    // Valve Status
    valveStatus: initialData.valveStatus || {},
    // Air Venting Done from Following Locations
    airVenting: initialData.airVenting || {},
    // Protection Trails
    protectionTrails: initialData.protectionTrails || {},
    // Bushing Test Tap
    bushingTestTap: initialData.bushingTestTap || {},
    ...initialData,
  })

  const valveStatusItems = [
    { id: "A", description: "Bucholz to Conservator" },
    { id: "B", description: "Main Tank to Bucholz" },
    { id: "C", description: "Radiator Top Valves" },
    { id: "D", description: "Radiator Bottom Valves" },
    { id: "E", description: "Top Filter Valve" },
    { id: "F", description: "Bottom Filter Valve" },
    { id: "G", description: "Drain Valve" },
  ]

  const airVentingItems = [
    { id: "1", description: "Main Tank" },
    { id: "2", description: "Bucholz Relay" },
    { id: "3", description: "HV Bushing" },
    { id: "4", description: "LV Bushing" },
    { id: "5", description: "Neutral Bushing" },
    { id: "6", description: "Radiator – Top" },
  ]

  const protectionTrailsItems = [
    { id: "1", description: "Buchholz checked by oil draining", type: "ALARM" },
    { id: "1b", description: "Buchholz checked by oil draining", type: "TRIP" },
    { id: "2", description: "MOG", type: "ALARM" },
    { id: "3", description: "PRV MAIN TANK", type: "TRIP" },
    { id: "4", description: "OTI", type: "ALARM" },
    { id: "4b", description: "OTI", type: "TRIP" },
    { id: "5", description: "WTI", type: "ALARM" },
    { id: "5b", description: "WTI", type: "TRIP" },
  ]

  const handleValveStatusChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      valveStatus: {
        ...prev.valveStatus,
        [id]: {
          ...prev.valveStatus[id],
          [field]: value,
        },
      },
    }))
  }

  const handleAirVentingChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      airVenting: {
        ...prev.airVenting,
        [id]: {
          ...prev.airVenting[id],
          [field]: value,
        },
      },
    }))
  }

  const handleProtectionTrailsChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      protectionTrails: {
        ...prev.protectionTrails,
        [id]: {
          ...prev.protectionTrails[id],
          [field]: value,
        },
      },
    }))
  }

  const handleBushingTestTapChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      bushingTestTap: {
        ...prev.bushingTestTap,
        [field]: value,
      },
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>PRE-CHARGING CHECK LIST</h2>
      </div>

      <table className="form-table">
        <thead>
          <tr>
            <th>Sr.N.</th>
            <th>Particulars</th>
            <th>Qty.</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>I</strong>
            </td>
            <td>
              <strong>Valve Status</strong>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          {valveStatusItems.map((item) => (
            <tr key={item.id}>
              <td>
                <strong>{item.id}</strong>
              </td>
              <td>
                <strong>{item.description}</strong>
              </td>
              <td>
                <input
                  type="text"
                  value={formData.valveStatus[item.id]?.qty || ""}
                  onChange={(e) => handleValveStatusChange(item.id, "qty", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData.valveStatus[item.id]?.status || ""}
                  onChange={(e) => handleValveStatusChange(item.id, "status", e.target.value)}
                />
              </td>
              <td></td>
            </tr>
          ))}
          <tr>
            <td>
              <strong>II</strong>
            </td>
            <td>
              <strong>Air Venting Done from Following Locations:</strong>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          {airVentingItems.map((item) => (
            <tr key={item.id}>
              <td>
                <strong>{item.id}</strong>
              </td>
              <td>
                <strong>{item.description}</strong>
              </td>
              <td>
                <input
                  type="text"
                  value={formData.airVenting[item.id]?.qty || ""}
                  onChange={(e) => handleAirVentingChange(item.id, "qty", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={formData.airVenting[item.id]?.status || ""}
                  onChange={(e) => handleAirVentingChange(item.id, "status", e.target.value)}
                />
              </td>
              <td></td>
            </tr>
          ))}
          <tr>
            <td>
              <strong>III</strong>
            </td>
            <td>
              <strong>Protection Trails</strong>
            </td>
            <td></td>
            <td>
              <strong>Checked</strong>
            </td>
            <td></td>
          </tr>
          {protectionTrailsItems.map((item) => (
            <tr key={`${item.id}-${item.type}`}>
              <td>
                <strong>{item.id}</strong>
              </td>
              <td>
                <strong>{item.description}</strong>
              </td>
              <td>
                <strong>{item.type}</strong>
              </td>
              <td>
                <input
                  type="text"
                  value={formData.protectionTrails[`${item.id}-${item.type}`]?.checked || ""}
                  onChange={(e) => handleProtectionTrailsChange(`${item.id}-${item.type}`, "checked", e.target.value)}
                />
              </td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <tbody>
          <tr>
            <td></td>
            <td>
              <strong>TRIP</strong>
            </td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>IV</strong>
            </td>
            <td>
              <strong>Bushing Test Tap</strong>
            </td>
            <td>
              <strong>HV</strong>
            </td>
            <td>
              <strong>LV</strong>
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <strong>Test Cap Earthed</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.bushingTestTap.hvTestCapEarthed || ""}
                onChange={(e) => handleBushingTestTapChange("hvTestCapEarthed", e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.bushingTestTap.lvTestCapEarthed || ""}
                onChange={(e) => handleBushingTestTapChange("lvTestCapEarthed", e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Next Form
        </button>
      </div>
    </form>
  )
}

// Form 2: Pre-Charging Check List - Part 2
function PreChargingChecklistPart2Form({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    // Oil Values
    bdvKV: initialData.bdvKV || "",
    moistureContentPPM: initialData.moistureContentPPM || "",
    // Final IR Values
    hvEarth15Sec: initialData.hvEarth15Sec || "",
    hvEarth60Sec: initialData.hvEarth60Sec || "",
    hvEarth600Sec: initialData.hvEarth600Sec || "",
    // Oil Level of conservator
    oilLevelConservator: initialData.oilLevelConservator || "",
    // HV Jumpers connected
    hvJumpersConnected: initialData.hvJumpersConnected || "",
    // LV Jumpers connected
    lvJumpersConnected: initialData.lvJumpersConnected || "",
    // Incoming LA Counter
    incomingLACounter: initialData.incomingLACounter || "",
    // Outgoing LA Counter
    outgoingLACounter: initialData.outgoingLACounter || "",
    // All CT Cable Terminated and Glands Sealed
    allCTCableTerminated: initialData.allCTCableTerminated || "",
    // Protection relays checked through breaker tripping
    protectionRelaysChecked: initialData.protectionRelaysChecked || "",
    // Anabond applied to HV Bushings
    anabondAppliedHVBushings: initialData.anabondAppliedHVBushings || "",
    // All joints properly sealed against Water Ingress
    allJointsSealed: initialData.allJointsSealed || "",
    // All Foreign material cleared from Transformer
    allForeignMaterialCleared: initialData.allForeignMaterialCleared || "",
    // Temperature
    temperatureWTI: initialData.temperatureWTI || "",
    temperatureOTI: initialData.temperatureOTI || "",
    // Remarks
    remarks: initialData.remarks || "",
    signatures: initialData.signatures || {
      vpesName: "",
      vpesSignature: "",
      vpesDate: "",
      customerName: "",
      customerSignature: "",
      customerDate: "",
    },
    photos: initialData.photos || {},
    ...initialData,
  })

  const handleSignatureChange = (key, type, value) => {
    setFormData((prev) => ({
      ...prev,
      signatures: {
        ...prev.signatures,
        [`${key}${type === "name" ? "Name" : type === "date" ? "Date" : "Signature"}`]: value,
      },
    }))
  }

  const handlePhotoChange = (key, file) => {
    setFormData((prev) => ({
      ...prev,
      photos: { ...prev.photos, [key]: file },
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const photoRequirements = [
    { key: "earthingMainTank", label: "Earthing's of main tank & bushing" },
    { key: "sealingCableGland", label: "Sealing of Cable gland" },
    { key: "bushingTestTap", label: "Bushing test tap & thimble" },
    { key: "buchholzTerminalPlate", label: "Buchholz terminal plate, etc...." },
    { key: "fullPhotoTransformer", label: "Full Photo of transformer" },
  ]

  const signatureRequirements = [
    { key: "vpes", label: "Checked by VPES:" },
    { key: "customer", label: "Witnessed By Customer:" },
  ]

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="company-header">
        <h2>PRE-CHARGING CHECK LIST - PART 2</h2>
      </div>

      <table className="form-table">
        <thead>
          <tr>
            <th></th>
            <th>Oil Values</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>V</strong>
            </td>
            <td>
              <strong>BDV</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.bdvKV}
                onChange={(e) => setFormData({ ...formData, bdvKV: e.target.value })}
              />
            </td>
            <td>
              <strong>KV</strong>
            </td>
          </tr>
          <tr>
            <td>
              <strong>2</strong>
            </td>
            <td>
              <strong>Moisture Content</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.moistureContentPPM}
                onChange={(e) => setFormData({ ...formData, moistureContentPPM: e.target.value })}
              />
            </td>
            <td>
              <strong>PPM</strong>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th></th>
            <th>Final IR Values</th>
            <th>15 sec.</th>
            <th>60 sec.</th>
            <th>600 sec.</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>VI</strong>
            </td>
            <td>
              <strong>HV – E</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth15Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth15Sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth60Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth60Sec: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={formData.hvEarth600Sec}
                onChange={(e) => setFormData({ ...formData, hvEarth600Sec: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <tbody>
          <tr>
            <td>
              <strong>VII</strong>
            </td>
            <td>
              <strong>Oil Level of conservator</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.oilLevelConservator}
                onChange={(e) => setFormData({ ...formData, oilLevelConservator: e.target.value })}
              />
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>VIII</strong>
            </td>
            <td>
              <strong>HV Jumpers connected</strong>
            </td>
            <td>
              <select
                value={formData.hvJumpersConnected}
                onChange={(e) => setFormData({ ...formData, hvJumpersConnected: e.target.value })}
              >
                <option value="">Yes /No</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>IX</strong>
            </td>
            <td>
              <strong>LV Jumpers connected</strong>
            </td>
            <td>
              <select
                value={formData.lvJumpersConnected}
                onChange={(e) => setFormData({ ...formData, lvJumpersConnected: e.target.value })}
              >
                <option value="">Yes /No</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>X</strong>
            </td>
            <td>
              <strong>Incoming LA Counter</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.incomingLACounter}
                onChange={(e) => setFormData({ ...formData, incomingLACounter: e.target.value })}
              />
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>XI</strong>
            </td>
            <td>
              <strong>Outgoing LA Counter</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.outgoingLACounter}
                onChange={(e) => setFormData({ ...formData, outgoingLACounter: e.target.value })}
              />
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>XII</strong>
            </td>
            <td>
              <strong>All CT Cable Terminated and Glands Sealed</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.allCTCableTerminated}
                onChange={(e) => setFormData({ ...formData, allCTCableTerminated: e.target.value })}
              />
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>XIII</strong>
            </td>
            <td>
              <strong>Protection relays checked through breaker tripping</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.protectionRelaysChecked}
                onChange={(e) => setFormData({ ...formData, protectionRelaysChecked: e.target.value })}
              />
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>1</strong>
            </td>
            <td>
              <strong>Anabond applied to HV Bushings</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.anabondAppliedHVBushings}
                onChange={(e) => setFormData({ ...formData, anabondAppliedHVBushings: e.target.value })}
              />
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>2</strong>
            </td>
            <td>
              <strong>All joints properly sealed against Water Ingress</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.allJointsSealed}
                onChange={(e) => setFormData({ ...formData, allJointsSealed: e.target.value })}
              />
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>3</strong>
            </td>
            <td>
              <strong>All Foreign material cleared from Transformer</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.allForeignMaterialCleared}
                onChange={(e) => setFormData({ ...formData, allForeignMaterialCleared: e.target.value })}
              />
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <table className="form-table" style={{ marginTop: "20px" }}>
        <tbody>
          <tr>
            <td>
              <strong>Temperature of</strong>
            </td>
            <td>
              <strong>°C</strong>
            </td>
            <td>
              <strong>WTI</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.temperatureWTI}
                onChange={(e) => setFormData({ ...formData, temperatureWTI: e.target.value })}
              />
            </td>
            <td>
              <strong>OTI</strong>
            </td>
            <td>
              <input
                type="text"
                value={formData.temperatureOTI}
                onChange={(e) => setFormData({ ...formData, temperatureOTI: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="form-group" style={{ marginTop: "30px" }}>
        <label>
          <strong>
            Remarks: The Transformer as mentioned above has been jointly cleared for charging as on _____. All the
            necessary pre-commissioning checks and protection trials have been found satisfactory. Transformer has been
            cleared from all foreign material and is ready for charging.
          </strong>
        </label>
        <textarea
          rows="4"
          value={formData.remarks}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          placeholder="Enter any additional remarks..."
        />
      </div>

      <PhotoUploadSection
        title="Earthing's of main tank & bushing, sealing of Cable gland, bushing test tap & thimble, Buchholz terminal plate, etc...., Full Photo of transformer"
        photos={photoRequirements}
        onPhotoChange={handlePhotoChange}
      />

      <div className="signature-section">
        <div className="signature-box">
          <label>Checked by VPES:</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.signatures.vpesName}
            onChange={(e) => handleSignatureChange("vpes", "name", e.target.value)}
          />
          <SignatureBox
            label=""
            nameValue=""
            onNameChange={() => {}}
            onSignatureChange={(signature) => handleSignatureChange("vpes", "signature", signature)}
            initialSignature={formData.signatures.vpesSignature}
          />
          <input
            type="date"
            value={formData.signatures.vpesDate}
            onChange={(e) => handleSignatureChange("vpes", "date", e.target.value)}
          />
        </div>

        <div className="signature-box">
          <label>Witnessed By Customer:</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.signatures.customerName}
            onChange={(e) => handleSignatureChange("customer", "name", e.target.value)}
          />
          <SignatureBox
            label=""
            nameValue=""
            onNameChange={() => {}}
            onSignatureChange={(signature) => handleSignatureChange("customer", "signature", signature)}
            initialSignature={formData.signatures.customerSignature}
          />
          <input
            type="date"
            value={formData.signatures.customerDate}
            onChange={(e) => handleSignatureChange("customer", "date", e.target.value)}
          />
        </div>
      </div>

      <div className="form-actions">
        {onPrevious && (
          <button type="button" onClick={onPrevious} className="prev-btn">
            Previous Form
          </button>
        )}
        <button type="submit" className="submit-btn">
          Submit Stage 5
        </button>
      </div>
    </form>
  )
}

// Stage 6 Form Components - Based on provided images

// Form 1: Work Completion Report
function WorkCompletionReportForm({ onSubmit, onPrevious, initialData, isLastFormOfStage }) {
  const [formData, setFormData] = useState({
    // Project Information
    customerName: initialData.customerName || "",
    orderNumber: initialData.orderNumber || "",
    location: initialData.location || "",
    // Transformer Details
    type: initialData.type || "auto Transformer",
    capacity: initialData.capacity || "",
    voltageRating: initialData.voltageRating || "",
    make: initialData.make || "",
    serialNumber: initialData.serialNumber || "",
    // Completion details
    completionDate: initialData.completionDate || "",
    chargingDate: initialData.chargingDate || "",
    commissioningDate: initialData.commissioningDate || "",
    // Signatures
    signatures: initialData.signatures || {
      vpesName: "",
      vpesDesignation: "",
      vpesSignature: "",
      vpesDate: "",
      customerName: "",
      customerDesignation: "",
      customerSignature: "",
      customerDate: "",
    },
    ...initialData,
  })

  const handleSignatureChange = (key, type, value) => {
    setFormData((prev) => ({
      ...prev,
      signatures: {
        ...prev.signatures,
        [`${key}${type.charAt(0).toUpperCase() + type.slice(1)}`]: value,
      },
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div
      className="form-container"
      style={{ background: "white", padding: "40px", maxWidth: "800px", margin: "0 auto" }}
    >
      {/* Header with logo and certifications */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          borderBottom: "3px solid #C41E3A",
          paddingBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#C41E3A" }}>V</div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>VISHVAS</div>
            <div style={{ fontSize: "1.2rem", color: "#666", letterSpacing: "2px" }}>POWER</div>
            <div style={{ fontSize: "0.8rem", color: "#666" }}>
              (A unit of M/s Vishvas Power Engineering Services Pvt Ltd)
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              background: "#C41E3A",
              color: "white",
              borderRadius: "50%",
              width: "80px",
              height: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 10px",
            }}
          >
            <div>
              <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>25</div>
              <div style={{ fontSize: "0.7rem" }}>YEARS</div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div
            style={{
              background: "#4CAF50",
              color: "white",
              padding: "5px 10px",
              borderRadius: "5px",
              marginBottom: "5px",
              fontSize: "0.8rem",
            }}
          >
            ISO CERTIFIED
          </div>
          <div style={{ fontSize: "0.7rem", color: "#333" }}>
            • 9001 Certified
            <br />• 14001 Certified
            <br />• 45001 Certified
          </div>
        </div>
      </div>

      {/* Red banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #C41E3A, #8B0000)",
          color: "white",
          padding: "10px 20px",
          marginBottom: "30px",
          clipPath: "polygon(0 0, 100% 0, 95% 100%, 0% 100%)",
        }}
      >
        <div style={{ fontSize: "1.1rem", fontWeight: "600" }}>Transformers upto 220 kV 250 MVA</div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", textDecoration: "underline", margin: "0 0 10px 0" }}>
            Work completion report
          </h1>
          <div style={{ textAlign: "right", fontSize: "1rem" }}>
            <strong>Date:-</strong>
            <input
              type="date"
              value={formData.completionDate}
              onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
              style={{ marginLeft: "10px", border: "none", borderBottom: "1px solid #333", background: "transparent" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "15px" }}>Project Information</h3>

          <div style={{ marginBottom: "15px" }}>
            <strong>Customer Name: </strong>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              style={{ border: "none", borderBottom: "1px solid #333", background: "transparent", width: "300px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <strong>Order Number: </strong>
            <input
              type="text"
              value={formData.orderNumber}
              onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
              style={{ border: "none", borderBottom: "1px solid #333", background: "transparent", width: "300px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <strong>Location: </strong>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              style={{ border: "none", borderBottom: "1px solid #333", background: "transparent", width: "200px" }}
            />
            <strong style={{ marginLeft: "20px" }}>SP/SSP</strong>
          </div>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "15px" }}>Transformer Details</h3>

          <div style={{ marginBottom: "10px" }}>
            <strong>Type: – auto Transformer</strong>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <strong>Capacity: </strong>
            <input
              type="text"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              style={{ border: "none", borderBottom: "1px solid #333", background: "transparent", width: "100px" }}
            />
            <strong>MVA</strong>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <strong>Voltage Rating: </strong>
            <input
              type="text"
              value={formData.voltageRating}
              onChange={(e) => setFormData({ ...formData, voltageRating: e.target.value })}
              style={{ border: "none", borderBottom: "1px solid #333", background: "transparent", width: "100px" }}
            />
            <strong>kV</strong>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <strong>Make: </strong>
            <input
              type="text"
              value={formData.make}
              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              style={{ border: "none", borderBottom: "1px solid #333", background: "transparent", width: "200px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <strong>Serial Number: </strong>
            <input
              type="text"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              style={{ border: "none", borderBottom: "1px solid #333", background: "transparent", width: "200px" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "15px", textDecoration: "underline" }}>
            Subject: <em>Completion of Transformer Erection, Testing and Commissioning Work</em>
          </h3>

          <p style={{ lineHeight: "1.6", marginBottom: "15px" }}>
            This is to certify that the erection, Testing and commissioning of the above-mentioned transformer have been
            completed in accordance with the terms and conditions of the referenced order.
          </p>

          <p style={{ lineHeight: "1.6", marginBottom: "15px" }}>
            The installation work has been jointly inspected and found satisfactory by the undersigned representatives.
            The transformer was successfully charged/commissioned on no-load at
            <input
              type="time"
              value={formData.chargingDate}
              onChange={(e) => setFormData({ ...formData, chargingDate: e.target.value })}
              style={{ border: "none", borderBottom: "1px solid #333", background: "transparent", margin: "0 5px" }}
            />
            hrs on
            <input
              type="date"
              value={formData.commissioningDate}
              onChange={(e) => setFormData({ ...formData, commissioningDate: e.target.value })}
              style={{ border: "none", borderBottom: "1px solid #333", background: "transparent", margin: "0 5px" }}
            />
            (date).
          </p>

          <p style={{ lineHeight: "1.6", marginBottom: "30px" }}>
            All works under the scope of the order have been completed, and no pending activities remain.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "50px" }}>
          <div style={{ width: "45%" }}>
            <h4 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "20px" }}>For VPES, Nagpur</h4>

            <div style={{ marginBottom: "15px" }}>
              <strong>Name: </strong>
              <input
                type="text"
                value={formData.signatures.vpesName}
                onChange={(e) => handleSignatureChange("vpes", "name", e.target.value)}
                style={{ border: "none", borderBottom: "1px solid #333", background: "transparent", width: "150px" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <strong>Designation: </strong>
              <input
                type="text"
                value={formData.signatures.vpesDesignation}
                onChange={(e) => handleSignatureChange("vpes", "designation", e.target.value)}
                style={{ border: "none", borderBottom: "1px solid #333", background: "transparent", width: "120px" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <strong>Signature: </strong>
              <SignatureBox
                label=""
                nameValue=""
                onNameChange={() => {}}
                onSignatureChange={(signature) => handleSignatureChange("vpes", "signature", signature)}
                initialSignature={formData.signatures.vpesSignature}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <strong>Date: </strong>
              <input
                type="date"
                value={formData.signatures.vpesDate}
                onChange={(e) => handleSignatureChange("vpes", "date", e.target.value)}
                style={{ border: "none", borderBottom: "1px solid #333", background: "transparent", width: "150px" }}
              />
            </div>
          </div>

          <div style={{ width: "45%" }}>
            <h4 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "20px" }}>For Customer</h4>

            <div style={{ marginBottom: "15px" }}>
              <strong>Name: </strong>
              <input
                type="text"
                value={formData.signatures.customerName}
                onChange={(e) => handleSignatureChange("customer", "name", e.target.value)}
                style={{ border: "none", borderBottom: "1px solid #333", background: "transparent", width: "150px" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <strong>Designation: </strong>
              <input
                type="text"
                value={formData.signatures.customerDesignation}
                onChange={(e) => handleSignatureChange("customer", "designation", e.target.value)}
                style={{ border: "none", borderBottom: "1px solid #333", background: "transparent", width: "120px" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <strong>Signature: </strong>
              <SignatureBox
                label=""
                nameValue=""
                onNameChange={() => {}}
                onSignatureChange={(signature) => handleSignatureChange("customer", "signature", signature)}
                initialSignature={formData.signatures.customerSignature}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <strong>Date: </strong>
              <input
                type="date"
                value={formData.signatures.customerDate}
                onChange={(e) => handleSignatureChange("customer", "date", e.target.value)}
                style={{ border: "none", borderBottom: "1px solid #333", background: "transparent", width: "150px" }}
              />
            </div>
          </div>
        </div>

        <div className="form-actions" style={{ marginTop: "50px" }}>
          {onPrevious && (
            <button type="button" onClick={onPrevious} className="prev-btn">
              Previous Form
            </button>
          )}
          <button type="submit" className="submit-btn">
            Submit Stage 6
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormStage
